import { Component, signal, computed, ElementRef, ViewChild, AfterViewChecked, HostListener, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { Subscription } from "rxjs";
import { ApiService } from "../../services/api.service";
import { ChatHistoryItem } from "../../models/api.models";

interface Message {
  role: "user" | "bot";
  text: string;
  time: number;
  typing?: boolean;
  error?: boolean;
  retryText?: string;
}

const STORAGE_KEY = "yass-ai-chat";
const WELCOME =
  "👋 Bonjour ! Je suis **Yass-AI**, l'assistant de Yassoungo.\nPosez-moi vos questions sur son **profil**, ses **projets**, ses **compétences** ou ses **services** !";

@Component({
  selector: "app-chatbot",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./chatbot.html",
  styleUrl: "./chatbot.css",
})
export class Chatbot implements AfterViewChecked, OnDestroy {
  @ViewChild("messagesContainer") messagesRef?: ElementRef<HTMLDivElement>;
  @ViewChild("inputEl") inputRef?: ElementRef<HTMLTextAreaElement>;

  readonly maxLength = 1000;

  readonly suggestions = [
    { icon: "fa-user", label: "Qui est Yassoungo ?" },
    { icon: "fa-code", label: "Quelles sont ses compétences ?" },
    { icon: "fa-folder-open", label: "Montre-moi ses projets" },
    { icon: "fa-briefcase", label: "Est-il disponible pour une mission ?" },
  ];

  isOpen = signal(false);
  isLoading = signal(false);
  inputMessage = signal("");
  showTeaser = signal(false);
  copiedIndex = signal<number | null>(null);
  messages = signal<Message[]>(this.restore());

  /** Show quick suggestions while the user hasn't asked anything yet. */
  showSuggestions = computed(() => !this.messages().some(m => m.role === "user"));
  charCount = computed(() => this.inputMessage().length);

  private shouldScroll = false;
  private pendingRequest?: Subscription;
  private teaserTimer?: ReturnType<typeof setTimeout>;

  constructor(private apiService: ApiService) {
    // Gentle proactive teaser, only once per session
    if (typeof window !== "undefined" && !sessionStorage.getItem(STORAGE_KEY + "-teased")) {
      this.teaserTimer = setTimeout(() => {
        if (!this.isOpen()) this.showTeaser.set(true);
        sessionStorage.setItem(STORAGE_KEY + "-teased", "1");
      }, 8000);
    }
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy() {
    this.pendingRequest?.unsubscribe();
    clearTimeout(this.teaserTimer);
  }

  @HostListener("document:keydown.escape")
  onEscape() {
    if (this.isOpen()) this.isOpen.set(false);
  }

  toggle() {
    this.isOpen.update(v => !v);
    this.showTeaser.set(false);
    if (this.isOpen()) {
      this.shouldScroll = true;
      setTimeout(() => this.inputRef?.nativeElement.focus(), 150);
    }
  }

  dismissTeaser(event: Event) {
    event.stopPropagation();
    this.showTeaser.set(false);
  }

  useSuggestion(text: string) {
    this.inputMessage.set(text);
    this.sendMessage();
  }

  sendMessage(override?: string) {
    const text = (override ?? this.inputMessage()).trim().slice(0, this.maxLength);
    if (!text || this.isLoading()) return;

    // History sent to the API = finished, non-error messages (excluding welcome)
    const history: ChatHistoryItem[] = this.messages()
      .slice(1)
      .filter(m => !m.typing && !m.error)
      .map(m => ({ role: m.role, text: m.text }));

    this.messages.update(msgs => [
      ...msgs.filter(m => !m.error),
      { role: "user", text, time: Date.now() },
      { role: "bot", text: "", time: Date.now(), typing: true },
    ]);
    this.inputMessage.set("");
    this.resetTextareaHeight();
    this.isLoading.set(true);
    this.shouldScroll = true;

    this.pendingRequest = this.apiService.chat(text, history).subscribe({
      next: res => this.finish({ role: "bot", text: res.reply, time: Date.now() }),
      error: (err: HttpErrorResponse) => {
        const msg =
          err.status === 429
            ? "⏳ Vous allez un peu vite ! Patientez une minute avant de reposer une question."
            : err.error?.reply ?? "Une erreur est survenue. Veuillez réessayer.";
        this.finish({ role: "bot", text: msg, time: Date.now(), error: true, retryText: text });
      },
    });
  }

  retry(msg: Message) {
    if (!msg.retryText) return;
    const text = msg.retryText;
    // Remove the failed exchange then resend
    this.messages.update(msgs => {
      const copy = msgs.filter(m => m !== msg);
      const lastUser = copy.map(m => m.role).lastIndexOf("user");
      if (lastUser > -1 && copy[lastUser].text === text) copy.splice(lastUser, 1);
      return copy;
    });
    this.sendMessage(text);
  }

  resetConversation() {
    this.pendingRequest?.unsubscribe();
    this.isLoading.set(false);
    this.messages.set([this.welcome()]);
    sessionStorage.removeItem(STORAGE_KEY);
    this.inputRef?.nativeElement.focus();
  }

  async copy(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text);
      this.copiedIndex.set(index);
      setTimeout(() => this.copiedIndex.set(null), 1500);
    } catch {}
  }

  onInput(event: Event) {
    const el = event.target as HTMLTextAreaElement;
    this.inputMessage.set(el.value);
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 110) + "px";
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /** Minimal, XSS-safe Markdown → HTML (escape first, then format). */
  render(text: string): string {
    const escape = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    const inline = (s: string) =>
      s
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
        .replace(
          /\[([^\]]+)\]\(((?:https?:\/\/|#|mailto:)[^\s)]+)\)/g,
          (_m, label, url) => `<a href="${url}"${url.startsWith("#") ? "" : ' target="_blank" rel="noopener noreferrer"'}>${label}</a>`
        )
        .replace(
          /(^|[\s(])(https?:\/\/[^\s<)]+)/g,
          '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>'
        );

    const lines = escape(text).split("\n");
    let html = "";
    let list: "ul" | "ol" | null = null;

    for (const raw of lines) {
      const line = raw.trimEnd();
      const ul = line.match(/^\s*[-*•]\s+(.*)$/);
      const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
      const type = ul ? "ul" : ol ? "ol" : null;

      if (type) {
        if (list !== type) {
          if (list) html += `</${list}>`;
          html += `<${type}>`;
          list = type;
        }
        html += `<li>${inline((ul ?? ol)![1])}</li>`;
        continue;
      }
      if (list) {
        html += `</${list}>`;
        list = null;
      }
      if (line.trim()) html += `<p>${inline(line.replace(/^#{1,6}\s+/, ""))}</p>`;
    }
    if (list) html += `</${list}>`;
    return html;
  }

  // ---------- private helpers ----------

  private finish(reply: Message) {
    this.messages.update(msgs => [...msgs.filter(m => !m.typing), reply]);
    this.isLoading.set(false);
    this.shouldScroll = true;
    this.persist();
    setTimeout(() => this.inputRef?.nativeElement.focus());
  }

  private welcome(): Message {
    return { role: "bot", text: WELCOME, time: Date.now() };
  }

  private persist() {
    try {
      const data = this.messages().filter(m => !m.typing && !m.error).slice(-40);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }

  private restore(): Message[] {
    try {
      const raw = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
      const parsed = raw ? (JSON.parse(raw) as Message[]) : null;
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch {}
    return [this.welcome()];
  }

  private resetTextareaHeight() {
    const el = this.inputRef?.nativeElement;
    if (el) el.style.height = "auto";
  }

  private scrollToBottom() {
    const el = this.messagesRef?.nativeElement;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }
}
