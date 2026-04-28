import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cv.html',
  styleUrl: './cv.css'
})
/**
 * Composant Curriculum Vitae — Midnight Aurora Edition
 * Design premium avec sidebar glassmorphism, timeline interactive
 * et animations reveal au scroll.
 */
export class Cv implements OnInit, AfterViewInit {
  constructor(public translation: TranslationService) {}
  
  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;

    // Reveal on scroll using IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Animate skill bars up on first view
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.cv-skill-fill');
            fills.forEach((fill: Element) => {
              const el = fill as HTMLElement;
              const targetWidth = el.style.width;
              el.style.width = '0';
              requestAnimationFrame(() => {
                setTimeout(() => { el.style.width = targetWidth; }, 50);
              });
            });
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    const skillsBlock = document.querySelector('.cv-skills-list');
    if (skillsBlock) skillObserver.observe(skillsBlock);
  }
}
