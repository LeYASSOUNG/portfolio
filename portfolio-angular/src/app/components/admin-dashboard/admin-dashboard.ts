import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Experience } from '../../models/api.models';
import { marked } from 'marked';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe, NgIf, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  activeTab = signal<'dashboard' | 'messages' | 'projects' | 'skills' | 'experiences' | 'blog' | 'security' | 'settings' | 'company' | 'minigame' | 'analytics' | 'newsletter' | 'testimonials' | 'comments' | 'media' | 'seo'>('dashboard');
  
  stats = signal<any>(null);
  articles = signal<any[]>([]);
  messages = signal<any[]>([]);
  projects = signal<any[]>([]);
  skills = signal<any[]>([]);
  experiences = signal<any[]>([]);
  settings = signal<any>({});
  companyServices = signal<any[]>([]);
  leaderboard = signal<any[]>([]);
  analyticsData = signal<any>(null);
  subscribers = signal<any[]>([]);
  testimonials = signal<any[]>([]);
  comments = signal<any[]>([]);
  mediaFiles = signal<any[]>([]);
  isUploadingMedia = signal(false);
  isDragging = signal(false);
  seos = signal<any[]>([]);
  // File Manager
  currentFolder = signal<string>('uploads');
  newFolderName = signal<string>('');
  showNewFolderInput = signal<boolean>(false);
  
  // Media Selector Modal
  showMediaModal = signal(false);
  mediaSelectionTarget = signal<'project' | 'article' | null>(null);

  // Recherche
  searchQuery = signal('');
  
  filteredProjects = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.projects().filter(p => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
  });

  filteredArticles = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.articles().filter(a => a.title?.toLowerCase().includes(q) || a.content?.toLowerCase().includes(q));
  });

  filteredMessages = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.messages().filter(m => m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q) || m.subject?.toLowerCase().includes(q) || m.message?.toLowerCase().includes(q));
  });

  maxPageViews = computed(() => {
    const pages = this.analyticsData()?.views_by_page || [];
    if (pages.length === 0) return 1;
    return Math.max(...pages.map((p: any) => Number(p.total) || 0));
  });

  // ---- BADGES SIDEBAR ----
  unreadMessagesCount = computed(() => this.messages().length);
  draftArticlesCount = computed(() => this.articles().filter((a: any) => !a.is_published).length);
  pendingCommentsCount = computed(() => this.comments().filter((c: any) => c.status === 'pending').length);

  // ---- PAGINATION ----
  readonly PAGE_SIZE = 10;

  // Messages
  messagesPage = signal(1);
  paginatedMessages = computed(() => {
    const start = (this.messagesPage() - 1) * this.PAGE_SIZE;
    return this.filteredMessages().slice(start, start + this.PAGE_SIZE);
  });
  messagesTotalPages = computed(() => Math.max(1, Math.ceil(this.filteredMessages().length / this.PAGE_SIZE)));

  // Subscribers
  subscribersPage = signal(1);
  paginatedSubscribers = computed(() => {
    const start = (this.subscribersPage() - 1) * this.PAGE_SIZE;
    return this.subscribers().slice(start, start + this.PAGE_SIZE);
  });
  subscribersTotalPages = computed(() => Math.max(1, Math.ceil(this.subscribers().length / this.PAGE_SIZE)));

  // Scores
  scoresPage = signal(1);
  paginatedScores = computed(() => {
    const start = (this.scoresPage() - 1) * this.PAGE_SIZE;
    return this.leaderboard().slice(start, start + this.PAGE_SIZE);
  });
  scoresTotalPages = computed(() => Math.max(1, Math.ceil(this.leaderboard().length / this.PAGE_SIZE)));

  // Comments
  commentsPage = signal(1);
  paginatedComments = computed(() => {
    const start = (this.commentsPage() - 1) * this.PAGE_SIZE;
    return this.comments().slice(start, start + this.PAGE_SIZE);
  });
  commentsTotalPages = computed(() => Math.max(1, Math.ceil(this.comments().length / this.PAGE_SIZE)));

  // ---- NEWSLETTER BROADCAST ----
  newsletterForm = { subject: '', body: '' };
  isSendingNewsletter = signal(false);

  // ---- STATS ENRICHIS ----
  dashboardStats = computed(() => {
    return {
      projects: this.projects().length,
      messages: this.messages().length,
      articles: this.articles().length,
      publishedArticles: this.articles().filter((a: any) => a.is_published).length,
      draftArticles: this.articles().filter((a: any) => !a.is_published).length,
      skills: this.skills().length,
      experiences: this.experiences().length,
      subscribers: this.subscribers().length,
      testimonials: this.testimonials().length,
      pendingComments: this.comments().filter((c: any) => c.status === 'pending').length,
      mediaFiles: this.mediaFiles().length,
    };
  });

  toast = signal<{message: string, type: string} | null>(null);

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3000);
  }

  // Formulaire nouveau projet
  newProject = { title: '', description: '', github: '', link: '', image: '' };
  editingProjectId: number | null = null;

  // Formulaire nouvelle compétence
  newSkill = { name: '', level: 0, category: '' };
  editingSkillId: number | null = null;

  // Formulaire nouvelle expérience
  newExperience: Partial<Experience> = { title: '', company: '', start_date: '', end_date: '', description: '' };
  editingExperienceId: number | null = null;

  // Formulaire de sécurité
  securityForm = { current_password: '', email: '', new_password: '' };
  securitySuccessMsg = '';
  securityErrorMsg = '';

  // Formulaire nouveau blog
  newArticle = { title: '', content: '', image: '', is_published: false };
  editingArticleId: number | null = null;
  editorMode: 'edit' | 'preview' = 'edit';
  parsedMarkdown: string = '';

  // Formulaire services d'entreprise
  newCompanyService = { icon: '', title: '', description: '', tags: [] as string[] };
  editingCompanyServiceId: number | null = null;
  serviceTagsString = '';

  // Formulaire témoignages
  newTestimonial = { author: '', role: '', content: '', avatar: '', rating: 5 };
  editingTestimonialId: number | null = null;

  // Réponses aux messages
  replyingToMessageId: number | null = null;
  messageReplyText = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadMessages();
    this.loadProjects();
    this.loadSkills();
    this.loadExperiences();
    this.loadArticles();
    this.loadSettings();
    this.loadCompanyServices();
    this.loadScores();
    this.loadAnalytics();
    this.loadSubscribers();
    this.loadTestimonials();
    this.loadComments();
    this.loadSeo();
  }

  setTab(tab: 'dashboard' | 'messages' | 'projects' | 'skills' | 'experiences' | 'blog' | 'security' | 'settings' | 'company' | 'minigame' | 'analytics' | 'newsletter' | 'testimonials' | 'comments' | 'media' | 'seo') {
    this.activeTab.set(tab);
    this.searchQuery.set('');
    if (tab === 'security') {
      this.loadCurrentUser();
    }
    if (tab === 'media') {
      this.loadMedia();
    }
  }

  loadCurrentUser() {
    this.apiService.getProjects().subscribe();
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.securityForm.email = user.email || '';
    }
  }

  loadStats() { this.apiService.getStats().subscribe(data => this.stats.set(data)); }
  loadArticles() { this.apiService.getArticles().subscribe(data => this.articles.set(data)); }
  loadMessages() { this.apiService.getMessages().subscribe(data => this.messages.set(data)); }
  loadProjects() { this.apiService.getProjects().subscribe(data => this.projects.set(data)); }
  loadSkills() { this.apiService.getSkills().subscribe(data => this.skills.set(data)); }
  loadExperiences() { this.apiService.getExperiences().subscribe(data => this.experiences.set(data)); }
  loadSettings() { this.apiService.getSettings().subscribe(data => this.settings.set(data)); }
  loadCompanyServices() { this.apiService.getCompanyServices().subscribe(data => this.companyServices.set(data)); }
  loadScores() { this.apiService.getScores().subscribe(data => this.leaderboard.set(data)); }
  loadAnalytics() { this.apiService.getAdminAnalytics().subscribe(data => this.analyticsData.set(data)); }
  loadSubscribers() { this.apiService.getAdminSubscribers().subscribe(data => this.subscribers.set(data)); }
  loadTestimonials() { this.apiService.getAdminTestimonials().subscribe(data => this.testimonials.set(data)); }
  loadComments() { this.apiService.getAdminComments().subscribe(data => this.comments.set(data)); }
  loadMedia(folder?: string) {
    const f = folder ?? this.currentFolder();
    this.currentFolder.set(f);
    this.apiService.getMedia(f).subscribe({ next: data => this.mediaFiles.set(data), error: () => {} });
  }
  loadSeo() {
    this.apiService.getSeo().subscribe(data => {
      // Add default pages if empty
      const defaultPages = ['home', 'projects', 'cv'];
      let current = data || [];
      defaultPages.forEach(p => {
        if (!current.find(s => s.page === p)) {
          current.push({ page: p, title: '', meta_description: '', og_image: '' });
        }
      });
      this.seos.set(current);
    });
  }

  saveSettings() {
    this.apiService.updateSettings(this.settings()).subscribe(() => {
      this.showToast('Paramètres sauvegardés avec succès !', 'success');
    });
  }

  saveSeo() {
    this.apiService.updateSeo(this.seos()).subscribe(() => {
      this.showToast('Paramètres SEO sauvegardés avec succès !', 'success');
    });
  }

  // ---- CRUD PROJECTS ----
  createProject() {
    if (!this.newProject.title || !this.newProject.description) {
      this.showToast('Veuillez remplir le titre et la description', 'error');
      return;
    }
    this.apiService.addProject(this.newProject).subscribe({
      next: () => {
        this.loadProjects();
        this.resetProjectForm();
        this.showToast('Projet créé avec succès', 'success');
      },
      error: () => this.showToast('Erreur lors de la création du projet', 'error')
    });
  }
  editProject(proj: any) {
    this.editingProjectId = proj.id;
    this.newProject = {
      title: proj.title || '',
      description: proj.description || '',
      github: proj.github || '',
      link: proj.link || '',
      image: proj.image || ''
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  updateProject() {
    if (!this.editingProjectId || !this.newProject.title || !this.newProject.description) return;
    this.apiService.updateProject(this.editingProjectId, this.newProject).subscribe({
      next: () => {
        this.loadProjects();
        this.resetProjectForm();
        this.showToast('Projet mis à jour', 'success');
      },
      error: () => this.showToast('Erreur de mise à jour du projet', 'error')
    });
  }
  cancelEdit() { this.resetProjectForm(); }
  private resetProjectForm() {
    this.editingProjectId = null;
    this.newProject = { title: '', description: '', github: '', link: '', image: '' };
  }
  deleteProject(id: number) {
    if (confirm('Supprimer ce projet définitivement ?')) {
      this.apiService.deleteProject(id).subscribe({
        next: () => {
          this.loadProjects();
          this.showToast('Projet supprimé', 'success');
        },
        error: () => this.showToast('Erreur lors de la suppression du projet', 'error')
      });
    }
  }

  // ---- CRUD SKILLS ----
  createSkill() {
    if (!this.newSkill.name || !this.newSkill.level) {
      this.showToast('Le nom et le niveau sont requis', 'error');
      return;
    }
    this.apiService.addSkill(this.newSkill).subscribe({
      next: () => {
        this.loadSkills();
        this.resetSkillForm();
        this.showToast('Compétence ajoutée', 'success');
      },
      error: () => this.showToast('Erreur lors de l\'ajout de la compétence', 'error')
    });
  }
  editSkill(skill: any) {
    this.editingSkillId = skill.id;
    this.newSkill = { ...skill };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  updateSkill() {
    if (!this.editingSkillId || !this.newSkill.name) return;
    this.apiService.updateSkill(this.editingSkillId, this.newSkill).subscribe({
      next: () => {
        this.loadSkills();
        this.resetSkillForm();
        this.showToast('Compétence mise à jour', 'success');
      },
      error: () => this.showToast('Erreur de mise à jour', 'error')
    });
  }
  cancelEditSkill() { this.resetSkillForm(); }
  private resetSkillForm() {
    this.editingSkillId = null;
    this.newSkill = { name: '', level: 0, category: '' };
  }
  deleteSkill(id: number) {
    if (confirm('Supprimer cette compétence ?')) {
      this.apiService.deleteSkill(id).subscribe({
        next: () => {
          this.loadSkills();
          this.showToast('Compétence supprimée', 'success');
        },
        error: () => this.showToast('Erreur lors de la suppression', 'error')
      });
    }
  }

  // ---- CRUD EXPERIENCES ----
  createExperience() {
    if (!this.newExperience.title || !this.newExperience.company || !this.newExperience.start_date) {
      this.showToast('Veuillez remplir le titre, l\'entreprise et la date de début', 'error');
      return;
    }
    this.apiService.addExperience(this.newExperience).subscribe({
      next: () => {
        this.loadExperiences();
        this.resetExperienceForm();
        this.showToast('Expérience ajoutée avec succès !', 'success');
      },
      error: () => this.showToast('Erreur lors de l\'ajout', 'error')
    });
  }
  editExperience(exp: any) {
    this.editingExperienceId = exp.id;
    this.newExperience = { ...exp };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  updateExperience() {
    if (!this.editingExperienceId || !this.newExperience.title) {
      this.showToast('Le titre est requis', 'error');
      return;
    }
    this.apiService.updateExperience(this.editingExperienceId, this.newExperience).subscribe({
      next: () => {
        this.loadExperiences();
        this.resetExperienceForm();
        this.showToast('Expérience mise à jour !', 'success');
      },
      error: () => this.showToast('Erreur lors de la mise à jour', 'error')
    });
  }
  cancelEditExperience() { this.resetExperienceForm(); }
  private resetExperienceForm() {
    this.editingExperienceId = null;
    this.newExperience = { title: '', company: '', start_date: '', end_date: '', description: '' };
  }
  deleteExperience(id: number) {
    if (confirm('Supprimer cette expérience ?')) {
      this.apiService.deleteExperience(id).subscribe({
        next: () => {
          this.loadExperiences();
          this.showToast('Expérience supprimée', 'success');
        },
        error: () => this.showToast('Erreur lors de la suppression', 'error')
      });
    }
  }

  // ---- MESSAGES ----
  deleteMessage(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce message ?')) {
      this.apiService.deleteMessage(id).subscribe(() => this.loadMessages());
    }
  }
  startReply(id: number) {
    this.replyingToMessageId = id;
    this.messageReplyText = '';
  }
  cancelReply() {
    this.replyingToMessageId = null;
    this.messageReplyText = '';
  }
  sendReply(id: number) {
    if (!this.messageReplyText) return;
    this.apiService.replyToMessage(id, this.messageReplyText).subscribe({
      next: () => {
        this.showToast('Réponse envoyée avec succès !', 'success');
        this.cancelReply();
        this.loadMessages();
      },
      error: () => {
        this.showToast('Erreur lors de l\'envoi de la réponse.', 'error');
      }
    });
  }

  // ---- CRUD ARTICLES (BLOG) ----
  insertMarkdown(prefix: string, suffix: string) {
    if (typeof document === 'undefined') return;
    const textarea = document.getElementById('articleContentTextarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = this.newArticle.content || '';
    
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);
    
    this.newArticle.content = before + prefix + (selection || 'texte') + suffix + after;
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selection || 'texte').length);
    }, 0);
    
    if (this.editorMode === 'preview') {
      this.updatePreview();
    }
  }

  setEditorMode(mode: 'edit' | 'preview') {
    this.editorMode = mode;
    if (mode === 'preview') {
      this.updatePreview();
    }
  }

  updatePreview() {
    this.parsedMarkdown = marked.parse(this.newArticle.content || '') as string;
  }

  createArticle() {
    if (!this.newArticle.title || !this.newArticle.content) {
      this.showToast('Veuillez remplir le titre et le contenu de l\'article', 'error');
      return;
    }
    this.apiService.addArticle(this.newArticle).subscribe({
      next: () => {
        this.loadArticles();
        this.resetArticleForm();
        this.showToast('Article créé avec succès', 'success');
      },
      error: () => this.showToast('Erreur lors de la création de l\'article', 'error')
    });
  }
  editArticle(article: any) {
    this.editingArticleId = article.id;
    this.newArticle = { ...article };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  updateArticle() {
    if (!this.editingArticleId || !this.newArticle.title) return;
    this.apiService.updateArticle(this.editingArticleId, this.newArticle).subscribe({
      next: () => {
        this.loadArticles();
        this.resetArticleForm();
        this.showToast('Article mis à jour', 'success');
      },
      error: () => this.showToast('Erreur lors de la mise à jour de l\'article', 'error')
    });
  }
  cancelEditArticle() { this.resetArticleForm(); }
  private resetArticleForm() {
    this.editingArticleId = null;
    this.newArticle = { title: '', content: '', image: '', is_published: false };
  }
  deleteArticle(id: number) {
    if (confirm('Supprimer cet article définitivement ?')) {
      this.apiService.deleteArticle(id).subscribe({
        next: () => {
          this.loadArticles();
          this.showToast('Article supprimé', 'success');
        },
        error: () => this.showToast('Erreur de suppression', 'error')
      });
    }
  }

  // ---- CRUD COMPANY SERVICES ----
  createCompanyService() {
    if (!this.newCompanyService.title) {
      this.showToast('Le titre du service est requis', 'error');
      return;
    }
    this.newCompanyService.tags = this.serviceTagsString.split(',').map(t => t.trim()).filter(t => t);
    this.apiService.addCompanyService(this.newCompanyService).subscribe({
      next: () => {
        this.loadCompanyServices();
        this.resetCompanyServiceForm();
        this.showToast('Service créé', 'success');
      },
      error: () => this.showToast('Erreur lors de la création du service', 'error')
    });
  }
  editCompanyService(service: any) {
    this.editingCompanyServiceId = service.id;
    this.newCompanyService = { ...service };
    this.serviceTagsString = (service.tags || []).join(', ');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  updateCompanyService() {
    if (!this.editingCompanyServiceId || !this.newCompanyService.title) return;
    this.newCompanyService.tags = this.serviceTagsString.split(',').map(t => t.trim()).filter(t => t);
    this.apiService.updateCompanyService(this.editingCompanyServiceId, this.newCompanyService).subscribe({
      next: () => {
        this.loadCompanyServices();
        this.resetCompanyServiceForm();
        this.showToast('Service mis à jour', 'success');
      },
      error: () => this.showToast('Erreur lors de la mise à jour du service', 'error')
    });
  }
  cancelEditCompanyService() { this.resetCompanyServiceForm(); }
  private resetCompanyServiceForm() {
    this.editingCompanyServiceId = null;
    this.newCompanyService = { icon: '', title: '', description: '', tags: [] };
    this.serviceTagsString = '';
  }
  deleteCompanyService(id: number) {
    if (confirm('Supprimer ce service ?')) {
      this.apiService.deleteCompanyService(id).subscribe({
        next: () => {
          this.loadCompanyServices();
          this.showToast('Service supprimé', 'success');
        },
        error: () => this.showToast('Erreur lors de la suppression', 'error')
      });
    }
  }

  // ---- SCORES ----
  deleteScore(id: number) {
    if (confirm('Supprimer ce score ?')) {
      this.apiService.deleteScore(id).subscribe({
        next: () => {
          this.loadScores();
          this.showToast('Score supprimé', 'success');
        },
        error: () => this.showToast('Erreur lors de la suppression', 'error')
      });
    }
  }

  // ---- NEWSLETTER ----
  deleteSubscriber(id: number) {
    if (confirm('Désinscrire cette personne ?')) {
      this.apiService.deleteSubscriber(id).subscribe({
        next: () => {
          this.loadSubscribers();
          this.showToast('Abonné supprimé', 'success');
        },
        error: () => this.showToast('Erreur lors de la désinscription', 'error')
      });
    }
  }

  // ---- TESTIMONIALS ----
  saveTestimonial() {
    if (!this.newTestimonial.author || !this.newTestimonial.content) {
      this.showToast('L\'auteur et le contenu sont requis', 'error');
      return;
    }
    if (this.editingTestimonialId) {
      this.apiService.updateTestimonial(this.editingTestimonialId, this.newTestimonial)
        .subscribe({
          next: () => {
            this.loadTestimonials();
            this.resetTestimonialForm();
            this.showToast('Témoignage mis à jour', 'success');
          },
          error: () => this.showToast('Erreur lors de la mise à jour', 'error')
        });
    } else {
      this.apiService.addTestimonial(this.newTestimonial)
        .subscribe({
          next: () => {
            this.loadTestimonials();
            this.resetTestimonialForm();
            this.showToast('Témoignage ajouté', 'success');
          },
          error: () => this.showToast('Erreur lors de l\'ajout', 'error')
        });
    }
  }

  editTestimonial(t: any) {
    this.editingTestimonialId = t.id;
    this.newTestimonial = { ...t };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteTestimonial(id: number) {
    if (confirm('Supprimer ce témoignage ?')) {
      this.apiService.deleteTestimonial(id).subscribe({
        next: () => {
          this.loadTestimonials();
          this.showToast('Témoignage supprimé', 'success');
        },
        error: () => this.showToast('Erreur lors de la suppression', 'error')
      });
    }
  }

  resetTestimonialForm() {
    this.newTestimonial = { author: '', role: '', content: '', avatar: '', rating: 5 };
    this.editingTestimonialId = null;
  }

  // ---- COMMENTS ----
  updateCommentStatus(id: number, status: 'pending' | 'approved' | 'rejected') {
    this.apiService.updateCommentStatus(id, status).subscribe({
      next: () => {
        this.loadComments();
        this.showToast('Statut du commentaire mis à jour', 'success');
      },
      error: () => this.showToast('Erreur lors de la mise à jour du statut', 'error')
    });
  }

  deleteComment(id: number) {
    if (confirm('Supprimer ce commentaire ?')) {
      this.apiService.deleteComment(id).subscribe({
        next: () => {
          this.loadComments();
          this.showToast('Commentaire supprimé', 'success');
        },
        error: () => this.showToast('Erreur lors de la suppression', 'error')
      });
    }
  }

  // ---- BACKUP ----
  downloadBackup() {
    this.apiService.downloadBackup().subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${new Date().toISOString()}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // ---- SECURITY ----
  updateSecurity() {
    this.securitySuccessMsg = '';
    this.securityErrorMsg = '';
    
    if (!this.securityForm.current_password || !this.securityForm.email) {
      this.securityErrorMsg = 'Veuillez remplir les champs obligatoires (Mot de passe actuel et Email).';
      return;
    }

    this.apiService.updateCredentials(this.securityForm).subscribe({
      next: (res: any) => {
        this.securitySuccessMsg = 'Identifiants mis à jour avec succès !';
        this.securityForm.current_password = '';
        this.securityForm.new_password = '';
        if (typeof window !== 'undefined' && res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      },
      error: (err) => {
        this.securityErrorMsg = err.error.message || 'Erreur lors de la mise à jour.';
      }
    });
  }

  logout() {
    this.apiService.logout().subscribe({
      next: () => {
        this.apiService.clearToken();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.apiService.clearToken();
        this.router.navigate(['/login']);
      }
    });
  }

  // ---- MEDIA MANAGER ----
  onMediaFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.handleFile(input.files[0]);
    input.value = '';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  private handleFile(file: File) {
    this.isUploadingMedia.set(true);
    this.apiService.uploadMedia(file, this.currentFolder()).subscribe({
      next: () => {
        this.loadMedia();
        this.isUploadingMedia.set(false);
        this.showToast(`Fichier uploadé avec succès !`, 'success');
      },
      error: () => {
        this.isUploadingMedia.set(false);
        this.showToast('Erreur lors de l\'upload du fichier.', 'error');
      }
    });
  }

  navigateToFolder(path: string) {
    this.loadMedia(path);
  }

  navigateUp() {
    const parts = this.currentFolder().split('/');
    if (parts.length <= 1) return;
    parts.pop();
    this.loadMedia(parts.join('/'));
  }

  createNewFolder() {
    const name = this.newFolderName().trim();
    if (!name) return;
    this.apiService.createFolder(name, this.currentFolder()).subscribe({
      next: () => {
        this.showToast('Dossier créé !', 'success');
        this.newFolderName.set('');
        this.showNewFolderInput.set(false);
        this.loadMedia();
      },
      error: () => this.showToast('Erreur lors de la création du dossier.', 'error')
    });
  }

  copyMediaUrl(url: string) {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url).then(() => {
        this.showToast('URL copiée dans le presse-papier !', 'success');
      });
    }
  }

  deleteMediaFile(item: any) {
    const label = item.type === 'folder' ? `le dossier "${item.name}"` : `"${item.name}"`;
    if (confirm(`Supprimer ${label} définitivement ?`)) {
      this.apiService.deleteMedia(item.path).subscribe({
        next: () => {
          this.loadMedia();
          this.showToast('Supprimé.', 'success');
        },
        error: () => this.showToast('Erreur lors de la suppression.', 'error')
      });
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
  }

  // ---- NEWSLETTER BROADCAST ----
  sendNewsletter() {
    if (!this.newsletterForm.subject || !this.newsletterForm.body) {
      this.showToast('Veuillez remplir le sujet et le contenu', 'error');
      return;
    }
    this.isSendingNewsletter.set(true);
    this.apiService.sendNewsletter(this.newsletterForm).subscribe({
      next: () => {
        this.showToast(`Newsletter envoyée à ${this.subscribers().length} abonnés !`, 'success');
        this.newsletterForm = { subject: '', body: '' };
        this.isSendingNewsletter.set(false);
      },
      error: () => {
        this.showToast('Erreur lors de l\'envoi de la newsletter', 'error');
        this.isSendingNewsletter.set(false);
      }
    });
  }

  // ---- EXPORT CSV ----
  exportSubscribersCSV() {
    const headers = ['Email', 'Date'];
    const rows = this.subscribers().map((s: any) => [s.email, s.created_at]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    this.downloadCSV(csv, 'abonnes-newsletter.csv');
  }

  exportScoresCSV() {
    const headers = ['Joueur', 'Score', 'Temps', 'Date'];
    const rows = this.leaderboard().map((s: any) => [s.player_name, s.score, s.time_taken, s.created_at]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    this.downloadCSV(csv, 'scores-minijeu.csv');
  }

  private downloadCSV(content: string, filename: string) {
    if (typeof document === 'undefined') return;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    this.showToast(`Export CSV téléchargé : ${filename}`, 'success');
  }

  // ---- MEDIA MODAL ----
  openMediaSelector(target: 'project' | 'article') {
    this.mediaSelectionTarget.set(target);
    this.showMediaModal.set(true);
    this.loadMedia(); // Rafraîchit la liste
  }

  selectMedia(url: string) {
    const target = this.mediaSelectionTarget();
    if (target === 'project') {
      this.newProject.image = url;
    } else if (target === 'article') {
      this.newArticle.image = url;
    }
    this.closeMediaModal();
  }

  closeMediaModal() {
    this.showMediaModal.set(false);
    this.mediaSelectionTarget.set(null);
  }
}
