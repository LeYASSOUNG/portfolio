import { Component, OnInit, AfterViewInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './cv.html',
  styleUrl: './cv.css',
})
/**
 * Composant Curriculum Vitae — Midnight Aurora Edition
 * Design premium avec sidebar glassmorphism, timeline interactive
 * et animations reveal au scroll.
 */
export class Cv implements OnInit, AfterViewInit {
  skills = signal<any[]>([]);
  experiences = signal<any[]>([]);
  settings = signal<any>({});
  apiUrl = environment.apiUrl;

  constructor(
    public translation: TranslationService,
    private apiService: ApiService
  ) {}

  /**
   * À l'initialisation, on remonte en haut de page.
   * Important car Angular conserve la position de scroll entre les routes.
   */
  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    this.apiService.getSkills().subscribe(data => {
      this.skills.set(data);
      setTimeout(() => this.initSkillObserver(), 100);
    });

    this.apiService.getExperiences().subscribe(data => {
      this.experiences.set(data);
    });
    
    this.apiService.getSettings().subscribe(data => {
      this.settings.set(data);
    });
  }

  /**
   * Après le rendu de la vue, on initialise les animations spécifiques au CV.
   */
  ngAfterViewInit() {
    if (typeof window === 'undefined') return;

    // --- ANIMATIONS D'APPARITION (REVEAL) ---
    // On observe les éléments avec la classe .reveal pour ajouter .visible au scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  }

  private initSkillObserver() {
    if (typeof window === 'undefined') return;
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.cv-skill-fill');
            fills.forEach((fill: Element) => {
              const el = fill as HTMLElement;
              const targetWidth = el.dataset['width'] || '0%';
              el.style.width = '0';
              requestAnimationFrame(() => {
                setTimeout(() => {
                  el.style.width = targetWidth;
                }, 100);
              });
            });
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    const skillsBlock = document.querySelector('.cv-skills-list');
    if (skillsBlock) skillObserver.observe(skillsBlock);
  }
}
