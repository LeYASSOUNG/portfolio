import { Component, HostListener, Inject, PLATFORM_ID, AfterViewInit, OnInit, OnDestroy, NgZone, DestroyRef, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Chatbot } from './components/chatbot/chatbot';
import { routeAnimations } from './animations';
import { ApiService } from './services/api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Chatbot],
  templateUrl: './app.html',
  animations: [routeAnimations],
})
/**
 * Composant racine de l'application.
 * Gère la structure principale et les effets globaux (Curseur dynamique, Scroll Indicator, Animations d'apparition).
 */
export class App implements AfterViewInit, OnInit, OnDestroy {
  /**
   * Vérifie si la page actuelle nécessite de masquer la navbar globale et le footer.
   * Utilisé pour les pages standalone (CV, Login, Admin).
   */
  get hideLayout(): boolean {
    const url = this.router.url;
    return url.includes('/cv') || url.includes('/login') || url.includes('/admin');
  }

  // --- GESTION DU CURSEUR ET DU SCROLL ---
  private mx = 0; // Position X cible de la souris
  private my = 0; // Position Y cible de la souris

  private cx = 0; // Position X actuelle du curseur fluide (interpolation)
  private cy = 0; // Position Y actuelle du curseur fluide (interpolation)
  private isMagnetic = false;
  private magneticTarget: HTMLElement | null = null;

  private animationFrameId: number | null = null; // ID de la boucle d'animation
  private isBrowser: boolean; // Flag pour éviter les erreurs de DOM sur le serveur (SSR)

  /** Stocke les AbortControllers pour nettoyer les event listeners entre navigations */
  private interactionAbortController: AbortController | null = null;
  
  // PWA Install Prompt
  deferredPrompt: any = null;
  showInstallBanner = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    private apiService: ApiService,
    private ngZone: NgZone
  ) {
    // Vérifie si l'application s'exécute dans un navigateur web (évite les erreurs en cas de Server-Side Rendering)
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Réinitialise les observateurs d'animations à chaque changement de page
    // (Angular étant une SPA, les nouveaux éléments DOM du router-outlet doivent être scannés)
    if (this.isBrowser) {
      this.router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe((event) => {
        // Tracking Analytics
        this.apiService.trackView(event.urlAfterRedirects).subscribe();
        
        // Petit délai pour laisser le temps au DOM de s'injecter
        setTimeout(() => {
          this.initObservers();
          this.setupInteractions(); // Réattache le curseur magnétique aux nouveaux éléments
        }, 150);
      });
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.apiService.getSettings().subscribe(settings => {
        if (settings.seo_title) {
          this.titleService.setTitle(settings.seo_title);
        }
        if (settings.seo_description) {
          this.metaService.updateTag({ name: 'description', content: settings.seo_description });
        }
        if (settings.seo_keywords) {
          this.metaService.updateTag({ name: 'keywords', content: settings.seo_keywords });
        }
        
        // --- INJECTION DU THÈME DYNAMIQUE ---
        if (settings.theme_primary) {
          document.body.style.setProperty('--primary', settings.theme_primary);
        }
        if (settings.theme_secondary) {
          document.body.style.setProperty('--secondary', settings.theme_secondary);
        }
      });
    }
  }

  /**
   * Méthode appelée après l'initialisation complète de la vue du composant.
   * On y place toute la logique interagissant avec le DOM natif.
   */
  ngAfterViewInit() {
    if (!this.isBrowser) return;

    const body = this.document.body;
    body.classList.add('js-ready');

    this.initCursor();
    this.setupInteractions();
    this.initObservers();
  }

  private initCursor() {
    const cur = this.document.getElementById('cursor');
    const dot = this.document.getElementById('cursorDot');

    const steps = () => {
      let targetX = this.mx;
      let targetY = this.my;

      if (this.isMagnetic && this.magneticTarget) {
        const rect = this.magneticTarget.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
        this.cx += (targetX - this.cx) * 0.2;
        this.cy += (targetY - this.cy) * 0.2;
      } else {
        this.cx += (targetX - this.cx) * 0.15;
        this.cy += (targetY - this.cy) * 0.15;
      }

      if (cur) {
        cur.style.left = this.cx + 'px';
        cur.style.top = this.cy + 'px';
      }
      if (dot) {
        dot.style.left = this.mx + 'px';
        dot.style.top = this.my + 'px';
      }

      this.animationFrameId = requestAnimationFrame(steps);
    };

    if (cur || dot) {
      this.ngZone.runOutsideAngular(() => {
        this.animationFrameId = requestAnimationFrame(steps);
      });
    }
  }

  /**
   * Configure les interactions du curseur magnétique.
   * Utilise un AbortController pour nettoyer les anciens listeners avant d'en ajouter de nouveaux,
   * évitant ainsi l'accumulation de listeners à chaque navigation.
   */
  private setupInteractions() {
    // Nettoyer les anciens listeners avant d'en ajouter de nouveaux
    if (this.interactionAbortController) {
      this.interactionAbortController.abort();
    }
    this.interactionAbortController = new AbortController();
    const { signal } = this.interactionAbortController;

    const cur = this.document.getElementById('cursor');
    const hoverElements = this.document.querySelectorAll('a, button, .interactive, .magnetic');
    hoverElements.forEach((el) => {
      const htmlEl = el as HTMLElement;

      htmlEl.addEventListener('mouseenter', () => {
        cur?.classList.add('hovered');
        if (htmlEl.classList.contains('magnetic') || htmlEl.tagName === 'A' || htmlEl.tagName === 'BUTTON') {
          this.isMagnetic = true;
          this.magneticTarget = htmlEl;
          cur?.classList.add('magnetic-active');
        }
      }, { signal });

      htmlEl.addEventListener('mouseleave', () => {
        cur?.classList.remove('hovered');
        this.isMagnetic = false;
        this.magneticTarget = null;
        cur?.classList.remove('magnetic-active');
      }, { signal });
    });
  }

  /**
   * Retourne l'état de l'animation basé sur la route active.
   * Utilisé dans le template pour déclencher les transitions.
   */
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  /**
   * Initialise les IntersectionObservers pour animer les éléments lorsqu'ils deviennent visibles.
   */
  private initObservers() {
    if (!this.isBrowser) return;

    // --- INTERSECTION OBSERVER : ANIMATIONS D'APPARITION (REVEAL) ---
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05 },
    );

    this.document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      } else {
        revealObs.observe(el);
      }
    });

    // --- INTERSECTION OBSERVER : COMPTEURS DE STATISTIQUES ---
    const statsSection = this.document.querySelector('.hero-stats');
    if (statsSection && !statsSection.classList.contains('counted')) {
      const statsObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('counted');
            entry.target.querySelectorAll('.stat-number').forEach((el) => {
              const htmlEl = el as HTMLElement;
              const target = parseInt(htmlEl.dataset['target'] || '0', 10);
              let n = 0;
              const step = Math.max(1, Math.ceil(target / 40));

              this.ngZone.runOutsideAngular(() => {
                const timer = setInterval(() => {
                  n = Math.min(n + step, target);
                  htmlEl.textContent = n + '+';
                  if (n >= target) clearInterval(timer);
                }, 45);
              });
            });
            statsObs.unobserve(entry.target);
          });
        },
        { threshold: 0.2 },
      );
      statsObs.observe(statsSection);
    }
  }

  /**
   * Écoute l'évènement de mouvement de souris sur toute la fenêtre.
   * Met à jour les coordonnées (mx, my) utilisées par l'animation du curseur.
   */
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (this.isBrowser) {
      this.mx = e.clientX;
      this.my = e.clientY;
    }
  }

  /**
   * Écoute l'évènement de défilement (scroll) pour la jauge de progression.
   * Ajuste visuellement la largeur de l'indicateur selon la position du scroll.
   */
  @HostListener('window:scroll', [])
  onScroll() {
    if (!this.isBrowser) return;
    const indicator = this.document.getElementById('scrollIndicator');
    const total = this.document.body.scrollHeight - window.innerHeight;

    if (indicator && total > 0) {
      // ratio compris entre 0 et 1 modifiant l'échelle horizontale CSS (transform: scaleX)
      indicator.style.transform = `scaleX(${window.scrollY / total})`;
    }
  }

  // --- GESTION DE LA PWA ---
  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(e: Event) {
    // Empêcher l'affichage automatique du prompt
    e.preventDefault();
    // Sauvegarder l'événement pour le déclencher plus tard
    this.deferredPrompt = e;
    // Afficher la bannière
    this.showInstallBanner = true;
  }

  installPwa() {
    this.showInstallBanner = false;
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('L\'utilisateur a accepté l\'installation de la PWA');
        }
        this.deferredPrompt = null;
      });
    }
  }

  dismissInstall() {
    this.showInstallBanner = false;
  }

  /**
   * Annule la boucle d'animation du curseur et les listeners pour éviter les fuites mémoire.
   */
  ngOnDestroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    // Nettoyage des event listeners du curseur magnétique
    if (this.interactionAbortController) {
      this.interactionAbortController.abort();
      this.interactionAbortController = null;
    }
  }
}
