import { Component, HostListener, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
/**
 * Composant de pied de page.
 * Gère l'inscription à la Newsletter et le bouton flottant "Retour en haut".
 */
export class Footer {
  private readonly SCROLL_THRESHOLD_BACK_TO_TOP = 500;

  private platformId = inject(PLATFORM_ID);
  public translation = inject(TranslationService);
  private apiService = inject(ApiService);
  
  settings = signal<any>({});

  constructor() {
    this.apiService.getSettings().subscribe(data => this.settings.set(data));
  }

  newsletterStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  showBackToTop = false;

  /**
   * Envoi du formulaire de newsletter de façon asynchrone (via Formspree).
   */
  onNewsletterSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.querySelector('.newsletter-input') as HTMLInputElement;
    const email = input.value;

    if (!email) return;

    this.newsletterStatus = 'loading';

    this.apiService.subscribeNewsletter(email).subscribe({
      next: () => {
        input.value = '';
        this.newsletterStatus = 'success';
      },
      error: () => {
        this.newsletterStatus = 'error';
        setTimeout(() => {
          this.newsletterStatus = 'idle';
        }, 3000);
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.showBackToTop = window.scrollY > this.SCROLL_THRESHOLD_BACK_TO_TOP;
    }
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
