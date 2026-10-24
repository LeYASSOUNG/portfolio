import { Component, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser, CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { PwaInstallService } from '../../services/pwa-install.service';
import { EasterEggService } from '../../services/easter-egg.service';
import { ThemeService } from '../../services/theme.service';

import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
/**
 * Composant de la barre de navigation.
 * Assure le routage intra-page, le basculement mobile (Hamburger)
 * et délègue la gestion des thèmes au ThemeService (SOLID).
 */
export class Navbar {
  activeSection = 'home';
  isMenuOpen = false;
  isScrolled = false;
  private logoClickCount = 0;

  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  public translation = inject(TranslationService);
  public pwaInstall = inject(PwaInstallService);
  public themeService = inject(ThemeService);
  private easterEgg = inject(EasterEggService);
  private router = inject(Router);

  get isDarkTheme(): boolean {
    return this.themeService.isDarkTheme();
  }

  /** Ouvre ou ferme le menu de la version mobile (Hamburger) */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /** Ferme explicitement le menu mobile (utile lors du clic sur un lien) */
  closeMenu() {
    this.isMenuOpen = false;
  }

  /** Définit la section courante et scrolle vers elle avec l'offset navbar */
  setActive(section: string) {
    this.activeSection = section;
    this.closeMenu(); // Ferme le menu si on est sur mobile

    // Easter Egg mobile
    if (section === 'home') {
      this.logoClickCount++;
      if (this.logoClickCount >= 5) {
        this.easterEgg.unlock();
        this.logoClickCount = 0;
      }
    } else {
      this.logoClickCount = 0;
    }

    // Si on n'est pas sur la page principale, on y navigue d'abord
    const currentPath = this.router.url.split('?')[0].split('#')[0];
    if (currentPath !== '/') {
      this.router.navigate(['/']).then(() => {
        this.scrollToSection(section);
      });
    } else {
      this.scrollToSection(section);
    }
  }

  private scrollToSection(section: string) {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const el = this.document.getElementById(section);
        if (el) {
          const navbarHeight = 80;
          const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
          window.scrollTo({ top, behavior: 'auto' });
        }
      }, 100); // Petit délai pour laisser Angular charger la page d'accueil
    }
  }

  /** Bascule manuellement entre le Thème Clair et le Thème Sombre */
  toggleTheme() {
    this.themeService.toggleTheme();
  }

  /** Bascule entre le Français et l'Anglais */
  toggleLanguage() {
    const newLang = this.translation.currentLang() === 'fr' ? 'en' : 'fr';
    this.translation.setLanguage(newLang);
  }

  /**
   * Logique de 'ScrollSpy'. Détecte dynamiquement la section visible
   * sur le viewport pour mettre en surbrillance le lien correspondant dans le menu.
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 20;

      const sections = ['home', 'about', 'company', 'skills', 'projects', 'game', 'contact'];
      for (const section of sections) {
        const element = this.document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const SCROLL_OFFSET = 100;
          if (rect.top <= SCROLL_OFFSET && rect.bottom >= SCROLL_OFFSET) {
            this.activeSection = section;
          }
        }
      }
    }
  }
}
