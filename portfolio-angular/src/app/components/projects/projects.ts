import { Component, AfterViewInit, PLATFORM_ID, Inject, signal, WritableSignal } from '@angular/core';
import { CommonModule, isPlatformBrowser, NgClass } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { GithubService, RepoStats } from '../../services/github';
import { Swiper } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

interface Project {
  id: string;
  repo: string;
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
export class Projects implements AfterViewInit {
  projects = signal<Project[]>([
    {
      id: 'p1',
      repo: 'LeYASSOUNG/ShopAfrica',
      images: ['Assets/images/quicklodge_1.png', 'Assets/images/quicklodge_2.png'],
      tags: ['Angular', 'Java', 'PostgreSQL'],
      githubUrl: 'https://github.com/LeYASSOUNG/ShopAfrica',
      demoUrl: '#'
    },
    {
      id: 'p2',
      repo: 'LeYASSOUNG/gestion-stock',
      images: ['Assets/images/lumina_1.png', 'Assets/images/lumina_2.png'],
      tags: ['Next.js', 'Node.js', 'Spring Boot'],
      githubUrl: 'https://github.com/LeYASSOUNG/gestion-stock',
      demoUrl: '#'
    },
    {
      id: 'p3',
      repo: 'LeYASSOUNG/portfolio',
      images: ['Assets/images/midnight_1.png', 'Assets/images/midnight_2.png'],
      tags: ['Angular', 'UI/UX', 'PWA'],
      githubUrl: 'https://github.com/LeYASSOUNG/portfolio',
      demoUrl: '#'
    }
  ]);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public translation: TranslationService,
    private github: GithubService
  ) {}

  async ngOnInit() {
    // Fetch stats and update signal
    const currentProjects = [...this.projects()];
    for (let i = 0; i < currentProjects.length; i++) {
      if (currentProjects[i].repo) {
        currentProjects[i].stats = await this.github.getRepoStats(currentProjects[i].repo);
        // On met à jour le signal à chaque fois pour un effet "progressif"
        this.projects.set([...currentProjects]);
      }
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initSwipers();
    }
  }

  private initSwipers() {
    setTimeout(() => {
      // 1. Carrousel global
      new Swiper('.projects-global-swiper', {
        modules: [Navigation, Pagination],
        slidesPerView: 1,
        spaceBetween: 30,
        grabCursor: true,
        pagination: { el: '.projects-pagination', clickable: true, dynamicBullets: true },
        navigation: { nextEl: '.global-next', prevEl: '.global-prev' },
        breakpoints: {
          768: { slidesPerView: 2, enabled: true },
          1100: { slidesPerView: 3, enabled: false }
        }
      });

      // 2. Carrousels internes
      new Swiper('.project-inner-swiper', {
        modules: [Navigation, Pagination],
        slidesPerView: 1,
        loop: true,
        nested: true,
        touchReleaseOnEdges: true,
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        pagination: { el: '.project-img-pagination', type: 'fraction' }
      });
    }, 600);
  }
}
