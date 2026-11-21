import { catchError, of } from 'rxjs';
import { Component, AfterViewInit, OnDestroy, OnInit, ElementRef, PLATFORM_ID, Inject, signal, computed, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser, NgClass } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { GithubService, RepoStats } from '../../services/github';
import { Swiper } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { ApiService } from '../../services/api.service';

interface Project {
  id: string;
  title: string;
  description: string;
  repo: string;
  category: 'angular' | 'fullstack' | 'uiux';
  images: string[];
  tags: string[];
  githubUrl: string;
  demoUrl: string;
  stats?: RepoStats;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
/**
 * Composant Projets
 * Affiche une grille de projets interactifs avec filtres par catégorie, carrousels d'images isolés et stats GitHub.
 */
export class Projects implements OnInit, AfterViewInit, OnDestroy {
  private autoScrollInterval: any;

  loadError = signal(false);

  activeCategory = signal<string>('all');

  projects = signal<Project[]>([]);

  filteredProjects = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'all') return this.projects();
    return this.projects().filter((p) => p.category === cat);
  });

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public translation: TranslationService,
    private github: GithubService,
    private apiService: ApiService,
    private ngZone: NgZone,
    private host: ElementRef<HTMLElement>
  ) {}

  setFilter(category: string) {
    this.activeCategory.set(category);
    if (isPlatformBrowser(this.platformId)) {
      this.scheduleSwipers();
    }
  }

  /**
   * Résout la catégorie pour le filtrage
   */
  private resolveCategory(title: string, desc: string, repo: string): 'angular' | 'fullstack' | 'uiux' {
    const text = `${title} ${desc} ${repo}`.toLowerCase();
    if (text.includes('angular') || repo.toLowerCase().includes('portfolio')) {
      return 'angular';
    }
    if (text.includes('shopafrica') || text.includes('ui/ux') || text.includes('yass digital') || text.includes('vue')) {
      return 'uiux';
    }
    return 'fullstack';
  }

  /**
   * Résout les tags technologiques associés
   */
  private resolveTags(title: string, repo: string): string[] {
    const r = (repo || '').toLowerCase();
    const t = (title || '').toLowerCase();

    if (r.includes('portfolio') || t.includes('portfolio')) {
      return ['Angular', 'Laravel', 'TypeScript', 'PostgreSQL'];
    }
    if (r.includes('yass-digital-lab') || t.includes('yass digital')) {
      return ['Vue.js', 'Nuxt', 'E-commerce', 'Tailwind CSS'];
    }
    if (r.includes('gestion-stock') || t.includes('gestion de stock') || t.includes('gestion-stock')) {
      return ['JavaScript', 'Node.js', 'Express', 'Inventaire'];
    }
    if (r.includes('promanager') || t.includes('promanager') || t.includes('ya-consulting')) {
      return ['Laravel', 'PHP', 'Vue.js', 'MySQL'];
    }
    if (r.includes('jobs-platform') || t.includes('jobs')) {
      return ['Laravel', 'Blade', 'PHP', 'Tailwind'];
    }
    if (r.includes('quicklodge') || t.includes('quicklodge')) {
      return ['Java', 'Spring Boot', 'PostgreSQL', 'Fullstack'];
    }
    if (r.includes('shopafrica') || t.includes('shopafrica')) {
      return ['Vue.js', 'JavaScript', 'UI/UX', 'E-Commerce'];
    }
    return ['Fullstack', 'Web'];
  }

  /**
   * Résout les images du projet pour alimenter le carrousel Swiper
   */
  private resolveImages(image: string | null | undefined, repo: string, title: string): string[] {
    const r = (repo || '').toLowerCase();
    const t = (title || '').toLowerCase();

    if (r.includes('quicklodge') || t.includes('quicklodge')) {
      return ['Assets/images/quicklodge_1.png', 'Assets/images/quicklodge_2.png'];
    }
    if (r.includes('yass-digital-lab') || t.includes('yass digital')) {
      return ['Assets/images/lumina_1.png', 'Assets/images/lumina_2.png'];
    }
    if (r.includes('portfolio') || t.includes('portfolio')) {
      return ['Assets/images/portfo image-1.png', 'Assets/images/lumina_1.png'];
    }
    if (r.includes('gestion-stock') || t.includes('gestion-stock') || t.includes('gestion de stock')) {
      return ['Assets/images/midnight_1.png', 'Assets/images/midnight_2.png'];
    }
    if (image) {
      return [image];
    }
    return ['Assets/images/photo-1467232004584-a241de8bcf5d.avif'];
  }

  /**
   * Initialisation : Récupération asynchrone des projets depuis l'API et des statistiques GitHub.
   */
  ngOnInit() {
    this.apiService
      .getProjects()
      .pipe(
        catchError(() => {
          this.loadError.set(true);
          return of([] as any[]);
        }),
      )
      .subscribe(async (apiProjects: any[]) => {
      // Transformation des données de l'API pour correspondre à l'interface locale
      const formattedProjects: Project[] = apiProjects.map(p => {
        const repo = p.github ? p.github.replace('https://github.com/', '').trim() : '';
        return {
          id: p.id.toString(),
          title: p.title,
          description: p.description,
          repo,
          category: p.category || this.resolveCategory(p.title, p.description, repo),
          images: this.resolveImages(p.image, repo, p.title),
          tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : this.resolveTags(p.title, repo),
          githubUrl: p.github,
          demoUrl: p.link,
        };
      });

      this.projects.set(formattedProjects);

      // Chargement des stats Github
      const currentProjects = this.projects();
      await Promise.all(
        currentProjects.map(async (project, i) => {
          if (project.repo) {
            try {
              const stats = await this.github.getRepoStats(project.repo);
              this.projects.update((projects) => {
                const updated = [...projects];
                updated[i] = { ...updated[i], stats };
                return updated;
              });
            } catch (e) {
              console.error('Erreur Github stats', e);
            }
          }
        })
      );

      if (isPlatformBrowser(this.platformId)) {
        this.scheduleSwipers();
      }
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.scheduleSwipers();
      this.initMobileAutoScroll();
    }
  }

  private swiperInstances: Swiper[] = [];

  ngOnDestroy() {
    clearTimeout(this.swiperTimer);
    clearTimeout(this.autoScrollStart);
    this.destroySwipers();
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  private destroySwipers() {
    this.swiperInstances.forEach((instance) => {
      if (instance && !instance.destroyed) {
        instance.destroy(true, true);
      }
    });
    this.swiperInstances = [];
  }

  /**
   * Initialise le défilement automatique du carrousel des projets sur mobile.
   */
  private initMobileAutoScroll() {
    const MOBILE_BREAKPOINT = 992;
    if (window.innerWidth > MOBILE_BREAKPOINT) return;

    this.autoScrollStart = setTimeout(() => {
      const grid = this.host.nativeElement.querySelector('.projects-grid') as HTMLElement;
      if (!grid) return;

      let isTouching = false;
      grid.addEventListener('touchstart', () => (isTouching = true), { passive: true });
      grid.addEventListener(
        'touchend',
        () => {
          setTimeout(() => (isTouching = false), 3000);
        },
        { passive: true },
      );

      this.ngZone.runOutsideAngular(() => {
        this.autoScrollInterval = setInterval(() => {
          if (isTouching) return;

          const currentScroll = grid.scrollLeft;
          const maxScroll = grid.scrollWidth - grid.clientWidth;
          const card = grid.querySelector('.project-wrapper');
          const cardWidth = card ? card.clientWidth : 300;

          if (currentScroll >= maxScroll - 10) {
            grid.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            grid.scrollTo({ left: currentScroll + cardWidth, behavior: 'smooth' });
          }
        }, 5000);
      });
    }, 1000);
  }

  /**
   * Initialise de manière isolée les carrousels Swiper pour chaque carte de projet.
   */
  private swiperTimer?: ReturnType<typeof setTimeout>;
  private autoScrollStart?: ReturnType<typeof setTimeout>;

  /** Regroupe les demandes d'initialisation en un seul passage (évite les cycles destroy/create en rafale). */
  private scheduleSwipers() {
    clearTimeout(this.swiperTimer);
    this.swiperTimer = setTimeout(() => this.initSwipers(), 200);
  }

  private initSwipers() {
    this.destroySwipers();
    {
      this.host.nativeElement.querySelectorAll('.project-glass-card').forEach((card) => {
        const swiperContainer = card.querySelector('.project-inner-swiper') as HTMLElement;
        if (!swiperContainer) return;
        const nextEl = card.querySelector('.swiper-button-next') as HTMLElement;
        const prevEl = card.querySelector('.swiper-button-prev') as HTMLElement;
        const paginationEl = card.querySelector('.project-img-pagination') as HTMLElement;

        const instance = new Swiper(swiperContainer, {
          modules: [Navigation, Pagination],
          slidesPerView: 1,
          loop: false,
          nested: true,
          touchReleaseOnEdges: true,
          navigation: { nextEl, prevEl },
          pagination: { el: paginationEl, clickable: true },
        });
        this.swiperInstances.push(instance);
      });
    }
  }
}
