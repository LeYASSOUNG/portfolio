import { Injectable, signal } from '@angular/core';

export type Language = 'fr' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  // Signal pour la langue actuelle (réactif)
  currentLang = signal<Language>('fr');

  private translations: any = {
    fr: {
      nav: {
        home: 'Accueil', about: 'À propos', skills: 'Compétences',
        projects: 'Projets', game: 'Puzzle', contact: 'Contact', cv: 'Mon CV'
      },
      hero: {
        badge: 'Disponible pour de nouveaux projets',
        greeting: 'Bonjour, je suis',
        title: 'Architecte Digital Full Stack',
        desc: 'Je fusionne code et design pour créer des expériences digitales <strong>exceptionnelles</strong>, alliant performance brute et esthétique premium sur l\'écosystème <strong>JavaScript</strong>.',
        cta_contact: 'Contactez-moi', cta_projects: 'Mes projets',
        exp: 'Ans d\'exp.', projects: 'Projets', services: 'Services',
        quality: 'Qualité Premium', performance: 'Performance'
      },
      about: {
        title: 'À propos de moi',
        subtitle: 'L\'intersection entre la créativité humaine et la précision technique.',
        who: 'Qui suis-je ?',
        desc: 'Je suis un <strong>Architecte Digital Full Stack</strong> passionné par la création d\'expériences web immersives. Ma mission est de transformer des idées complexes en solutions digitales élégantes et scalables.',
        webdev: 'Développement Web', webdev_sub: 'Modernes & Réactifs',
        cloud: 'Architecture Cloud', cloud_sub: 'Scalable & Sécurisée',
        backend: 'Backend Expert', backend_sub: 'APIs Hautes-Performances',
        uiux: 'UI/UX Mastery', uiux_sub: 'Expériences Intuitives',
        view_cv: 'Voir le CV', journey: 'Mon Parcours',
        tl1_title: 'Développeur Full Stack', tl1_date: '2026 – Présent', tl1_org: 'Tech Solutions Inc.',
        tl1_desc: 'Direction technique sur des projets critiques avec Angular et Node.js.',
        tl2_title: 'Développeur Frontend', tl2_date: '2025 – 2026', tl2_org: 'Digital Creations',
        tl2_desc: 'Spécialisation dans les micro-interactions et le design system atomique.',
        tl3_title: 'Diplôme en Informatique', tl3_date: '2023 – 2026', tl3_org: 'Université Polytechnique de Bingerville',
        tl3_desc: 'Licence MIAGE — Méthodes Informatiques Appliquées à la Gestion des Entreprises.'
      },
      skills: {
        title: 'Compétences', subtitle: 'Mon arsenal technologique pour bâtir le futur.'
      },
      game: {
        title: 'Puzzle des langages',
        subtitle: 'Trouve les langages de programmation caches dans la grille.',
        progress: 'Progression',
        clear: 'Effacer',
        new: 'Nouvelle grille',
        hint: 'Clique une lettre de depart puis une lettre d arrivee en ligne droite.',
        ready: 'Selectionne le debut d un mot.',
        pick_end: 'Choisis maintenant la lettre de fin.',
        invalid_line: 'Selection invalide: reste sur une ligne droite.',
        not_word: 'Ce mot ne fait pas partie de la liste.',
        word_found: 'Bien joue ! {word} trouve.',
        completed: 'Bravo ! Tous les langages ont ete trouves.'
      },
      projects: {
        title: 'Mes Projets', subtitle: 'Une sélection de mes réalisations techniques les plus significatives.',
        featured: 'En vedette', live: 'Voir démo', code: 'Code Source',
        p1_title: 'QuickLodge Hotel Platform', p1_desc: 'Plateforme haut de gamme de réservation touristique avec gestion hôtelière complète et paiements sécurisés.',
        p2_title: 'Lumina Inventory System', p2_desc: 'Solution de gestion de stocks intelligente avec tableaux de bord analytiques et collaboration en temps réel.',
        p3_title: 'Midnight Aurora Portfolio', p3_desc: 'Expérience immersive présentant mon expertise technique via une interface premium et interactive.',
        view_github: 'Voir tout mon univers GitHub'
      },
      contact: {
        title: 'Contact',
        subtitle: 'Une idée ? Un projet ? Parlons-en.',
        name: 'Votre nom', email: 'Votre email', subject: 'Sujet', message: 'Votre message',
        send: 'Envoyer', sending: 'Envoi...', success: 'Message envoyé !', error: 'Erreur, réessayez.',
        copy: 'Copier l\'email'
      },
      footer: {
        rights: 'Tous droits réservés.',
        newsletter_title: 'Restez informé',
        newsletter_desc: 'Recevez mes dernières réalisations.',
        subscribe: 'S\'abonner', scroll_top: 'Haut de page'
      },
      pwa: {
        install: 'Installer l\'application'
      },
      cv: {
        back: 'Retour au Portfolio',
        download: 'Télécharger PDF',
        title: 'Étudiant Licence MIAGE',
        available: 'Disponible pour stage',
        contact: 'Contact',
        skills: 'Compétences',
        languages: 'Langues',
        french: 'Français', french_level: 'Langue maternelle',
        english: 'Anglais', english_level: 'Notions',
        interests: 'Intérêts',
        socials: 'Réseaux',
        role: 'Développeur Web Full Stack · Étudiant en Licence MIAGE',
        profile_title: 'Profil Professionnel',
        profile_desc: 'Étudiant passionné en Licence 3 MIAGE, spécialisé dans le développement web full stack avec une forte sensibilité UI/UX. Autodidacte et curieux, je conçois des interfaces modernes, accessibles et performantes — de l\'idée au déploiement. Je recherche activement une première expérience professionnelle ou un stage pour mettre en pratique mes compétences dans un environnement stimulant.',
        education_title: 'Formations',
        miage: 'Licence MIAGE',
        miage_desc: 'Méthodes Informatiques Appliquées à la Gestion des Entreprises. Développement web, bases de données, systèmes d\'information, UML.',
        bac: 'Baccalauréat Série D',
        bac_desc: 'Sciences de la vie et de la Terre — Mention Bien.',
        exp_title: 'Projets & Expériences',
        p1_title: 'QuickLodge — Plateforme Hôtelière',
        p1_item1: 'Architecture full stack avec Angular 21 & Spring Boot',
        p1_item2: 'Paiements Wave et Orange Money intégrés',
        p1_item3: 'Gestion des réservations, chambres et restaurants',
        p1_item4: 'Dashboard administrateur avec statistiques temps réel',
        p2_title: 'Portfolio Midnight Aurora',
        p2_item1: 'Design system glassmorphism & animations CSS avancées',
        p2_item2: 'Angular 21 Zoneless avec animations micro-interactions',
        p2_item3: 'Accessibilité WCAG et performances optimisées',
        p3_title: 'Projets Académiques MIAGE',
        p3_item1: 'Conception et implémentation de bases de données MySQL',
        p3_item2: 'Modélisation UML (use cases, diagrammes de classes)',
        p3_item3: 'Développement d\'applications web en PHP/JavaScript'
      }
    },
    en: {
      nav: {
        home: 'Home', about: 'About', skills: 'Skills',
        projects: 'Projects', game: 'Puzzle', contact: 'Contact', cv: 'My Resume'
      },
      hero: {
        badge: 'Available for new projects',
        greeting: 'Hello, I am',
        title: 'Full Stack Digital Architect',
        desc: 'I merge code and design to create <strong>exceptional</strong> digital experiences, combining raw performance and premium aesthetics on the <strong>JavaScript</strong> ecosystem.',
        cta_contact: 'Contact me', cta_projects: 'My projects',
        exp: 'Yrs of exp.', projects: 'Projects', services: 'Services',
        quality: 'Premium Quality', performance: 'Performance'
      },
      about: {
        title: 'About Me',
        subtitle: 'The intersection between human creativity and technical precision.',
        who: 'Who am I?',
        desc: 'I am a passionate <strong>Full Stack Digital Architect</strong> focused on building immersive web experiences. My mission is to transform complex ideas into elegant, scalable digital solutions.',
        webdev: 'Web Development', webdev_sub: 'Modern & Reactive',
        cloud: 'Cloud Architecture', cloud_sub: 'Scalable & Secure',
        backend: 'Backend Expert', backend_sub: 'High-Performance APIs',
        uiux: 'UI/UX Mastery', uiux_sub: 'Intuitive Experiences',
        view_cv: 'View Resume', journey: 'My Journey',
        tl1_title: 'Full Stack Developer', tl1_date: '2026 – Present', tl1_org: 'Tech Solutions Inc.',
        tl1_desc: 'Technical leadership on critical projects with Angular and Node.js.',
        tl2_title: 'Frontend Developer', tl2_date: '2025 – 2026', tl2_org: 'Digital Creations',
        tl2_desc: 'Specializing in micro-interactions and atomic design systems.',
        tl3_title: 'Computer Science Degree', tl3_date: '2023 – 2026', tl3_org: 'Polytechnic University of Bingerville',
        tl3_desc: 'MIAGE License — Computer Methods Applied to Business Management.'
      },
      skills: {
        title: 'Skills', subtitle: 'My technological arsenal to build the future.'
      },
      game: {
        title: 'Language puzzle',
        subtitle: 'Find the hidden programming languages in the grid.',
        progress: 'Progress',
        clear: 'Clear',
        new: 'New grid',
        hint: 'Click a start letter, then an end letter in a straight line.',
        ready: 'Select the first letter of a word.',
        pick_end: 'Now choose the ending letter.',
        invalid_line: 'Invalid selection: stay on a straight line.',
        not_word: 'This word is not in the list.',
        word_found: 'Nice! {word} found.',
        completed: 'Great job! You found every language.'
      },
      projects: {
        title: 'Projects', subtitle: 'Concrete achievements that speak for themselves.',
        featured: 'Featured', live: 'Live Demo', code: 'Source Code',
        p1_title: 'QuickLodge Hotel Platform', p1_desc: 'High-end tourism booking platform with complete hotel management and secure payments.',
        p2_title: 'Lumina Inventory System', p2_desc: 'Smart stock management solution with analytical dashboards and real-time collaboration.',
        p3_title: 'Midnight Aurora Portfolio', p3_desc: 'Immersive experience showcasing my technical expertise through a premium and interactive interface.',
        view_github: 'View all my GitHub universe'
      },
      contact: {
        title: 'Contact',
        subtitle: 'An idea? A project? Let\'s talk.',
        name: 'Your name', email: 'Your email', subject: 'Subject', message: 'Your message',
        send: 'Send', sending: 'Sending...', success: 'Message sent!', error: 'Error, please retry.',
        copy: 'Copy email'
      },
      footer: {
        rights: 'All rights reserved.',
        newsletter_title: 'Stay informed',
        newsletter_desc: 'Receive my latest work.',
        subscribe: 'Subscribe', scroll_top: 'Back to top'
      },
      pwa: {
        install: 'Install the app'
      },
      cv: {
        back: 'Back to Portfolio',
        download: 'Download PDF',
        title: 'MIAGE Degree Student',
        available: 'Available for internship',
        contact: 'Contact',
        skills: 'Skills',
        languages: 'Languages',
        french: 'French', french_level: 'Native',
        english: 'English', english_level: 'Basic notions',
        interests: 'Interests',
        socials: 'Socials',
        role: 'Full Stack Web Developer · MIAGE Degree Student',
        profile_title: 'Professional Profile',
        profile_desc: 'Passionate L3 MIAGE student specialized in full stack web development with strong UI/UX sensitivity. Self-taught and curious, I design modern, accessible, and high-performance interfaces — from concept to deployment. I am actively seeking a first professional experience or internship to apply my skills in a stimulating environment.',
        education_title: 'Education',
        miage: 'MIAGE Degree',
        miage_desc: 'Computer Methods Applied to Business Management. Web development, databases, information systems, UML.',
        bac: 'High School Diploma (Série D)',
        bac_desc: 'Life and Earth Sciences — With Honors.',
        exp_title: 'Projects & Experience',
        p1_title: 'QuickLodge — Hotel Platform',
        p1_item1: 'Full stack architecture with Angular 21 & Spring Boot',
        p1_item2: 'Integrated Wave and Orange Money payments',
        p1_item3: 'Management of bookings, rooms, and restaurants',
        p1_item4: 'Admin dashboard with real-time statistics',
        p2_title: 'Midnight Aurora Portfolio',
        p2_item1: 'Glassmorphism design system & advanced CSS animations',
        p2_item2: 'Angular 21 Zoneless with micro-interaction animations',
        p2_item3: 'WCAG accessibility and optimized performance',
        p3_title: 'MIAGE Academic Projects',
        p3_item1: 'Design and implementation of MySQL databases',
        p3_item2: 'UML modeling (use cases, class diagrams)',
        p3_item3: 'Development of web applications in PHP/JavaScript'
      }
    }
  };

  constructor() {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('lang') as Language;
      if (savedLang) {
        this.currentLang.set(savedLang);
      }
    }
  }

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
  }

  translate(key: string): string {
    const keys = key.split('.');
    let result = this.translations[this.currentLang()];
    
    for (const k of keys) {
      if (result) {
        result = result[k];
      }
    }
    
    return result || key;
  }
}
