# 🚀 Portfolio de Diarrassouba (Yassoungo)

> Portfolio professionnel Full Stack — Angular 22 + Laravel 12 + PostgreSQL

[![Angular](https://img.shields.io/badge/Angular-22.0.8-dd0031?logo=angular)](https://angular.dev)
[![Laravel](https://img.shields.io/badge/Laravel-12-ff2d20?logo=laravel)](https://laravel.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?logo=postgresql)](https://www.postgresql.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript)](https://www.typescriptlang.org)

---

## 📌 À propos

Portfolio professionnel de **Yassoungo Youssouf Diarrassouba**, étudiant MIAGE et développeur Full Stack passionné. Ce projet est une application complète composée d'un **frontend Angular avec SSR** et d'une **API REST Laravel** alimentant un système de gestion de contenu intégral.

---

## 🏗️ Architecture du projet

```text
portfolio/
├── portfolio-angular/       # Frontend Angular 22 (SSR)
├── portfolio-backend/       # API REST Laravel 12
└── README.md                # Ce fichier
```

---

## ✨ Fonctionnalités

### 🎨 Frontend (Angular 22)
| Fonctionnalité | Détail |
|---|---|
| **Design premium** | Glassmorphisme, dark mode, animations fluides |
| **Responsive** | Mobile-First, adapté à tous les écrans |
| **SPA + SSR** | Navigation sans rechargement + pré-rendu serveur |
| **Multilingue** | Basculement FR/EN en temps réel (Angular Signals) |
| **Chatbot IA** | Conversation avec Gemini (contexte dynamique DB) |
| **Blog** | Articles avec système de commentaires modérés |
| **Livre d'or** | Messages publics via OAuth GitHub |
| **Mini-jeu** | Jeu interactif avec classement en temps réel |
| **Newsletter** | Abonnement par email avec envoi automatisé |
| **Now Playing** | Affichage du dernier commit GitHub en direct |
| **GitHub Stats** | Stats de profil et top repos via l'API GitHub |
| **Parcours** | Timeline académique & professionnelle dynamique |
| **Section CV** | Page dédiée avec téléchargement PDF |
| **Témoignages** | Section avis clients/partenaires |
| **Animations** | Scroll Reveal, curseur magnétique, parallax |

### ⚙️ Backend (Laravel 12 API)
| Fonctionnalité | Détail |
|---|---|
| **API REST** | Routes publiques & protégées (Sanctum) |
| **Admin Panel** | Dashboard complet côté Angular |
| **GitHub OAuth** | Connexion pour le livre d'or via Socialite |
| **IA Gemini** | Proxy sécurisé vers l'API Gemini Flash |
| **Newsletter** | Événements & Listeners pour envoi automatique |
| **Analytics** | Tracking de pages vues |
| **Sauvegarde** | Export JSON de la base de données |

---

## 🛠️ Stack Technique

### Frontend
- **Angular 22.0.8** — Standalone Components, Signals, SSR
- **TypeScript 6** — Typage strict
- **CSS3 Vanilla** — Glassmorphism, animations, Grid/Flex
- **Swiper.js** — Carrousels d'images des projets
- **Font Awesome** — Icônes
- **Google Fonts (Poppins)** — Typographie principale

### Backend
- **Laravel 12** — PHP 8.2
- **PostgreSQL 16** — Base de données relationnelle
- **Laravel Sanctum** — Authentification par tokens
- **Laravel Socialite** — OAuth GitHub
- **Gemini Flash API** — Chatbot IA (Google DeepMind)

---

## 📁 Structure détaillée

```text
portfolio/
├── portfolio-angular/
│   └── src/app/
│       ├── components/
│       │   ├── about/          # À propos + GitHub Stats + Timeline
│       │   ├── blog/           # Liste des articles
│       │   ├── blog-post/      # Article individuel + commentaires
│       │   ├── chatbot/        # Chat IA (Gemini)
│       │   ├── company/        # Services professionnels
│       │   ├── contact/        # Formulaire de contact
│       │   ├── cv/             # Page Curriculum Vitae
│       │   ├── footer/         # Pied de page + Newsletter
│       │   ├── guestbook/      # Livre d'or
│       │   ├── mini-game/      # Jeu interactif
│       │   ├── navbar/         # Navigation responsive
│       │   ├── now-playing/    # Activité GitHub en direct
│       │   ├── projects/       # Portfolio de projets
│       │   └── skills/         # Grille de compétences
│       └── services/
│           ├── api.service.ts
│           ├── github.ts
│           ├── theme.service.ts
│           └── translation.service.ts
└── portfolio-backend/
    └── app/Http/Controllers/Api/
        ├── ArticleController.php
        ├── AuthController.php
        ├── ChatController.php      # Chatbot Gemini
        ├── CommentController.php
        ├── CvController.php
        ├── ExperienceController.php
        ├── GithubController.php    # Stats + Now Playing
        ├── GuestbookController.php
        ├── ProjectController.php
        ├── SkillController.php
        ├── SocialAuthController.php # OAuth GitHub
        ├── SubscriberController.php
        └── TestimonialController.php
```

---

## 🚀 Installation et lancement

### Prérequis
- Node.js `v22.22.3+` ou `v24.15.0+`
- PHP `8.2+` & Composer
- PostgreSQL `16+`

### 1. Frontend Angular

```bash
cd portfolio-angular
npm install --legacy-peer-deps
npm run start          # Développement → http://localhost:4200
# npm run build        # Production
```

### 2. Backend Laravel

```bash
cd portfolio-backend
composer install
cp .env.example .env
# Remplir .env : DB_*, GITHUB_*, GEMINI_API_KEY
php artisan key:generate
php artisan migrate --seed
php artisan serve      # API → http://localhost:8000
```

### Variables d'environnement requises (`.env` Backend)

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=portfolio
DB_USERNAME=...
DB_PASSWORD=...

GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_REDIRECT_URI=http://localhost:8000/api/auth/github/callback

GEMINI_API_KEY=...
```

---

## 🎨 Design System

| Variable | Valeur |
|---|---|
| Accent Bleu | `#3b82f6` |
| Accent Violet | `#8b5cf6` |
| Accent Cyan | `#06b6d4` |
| Fond sombre | `#0a0a1a` |
| Fond section | `#0f0f23` |

---

## 🔗 Liens

- **GitHub** : [LeYASSOUNG](https://github.com/LeYASSOUNG)
- **LinkedIn** : [Yassoungo Youssouf Diarrassouba](https://www.linkedin.com/in/yassoungo-youssouf-diarrassouba-0b7037306)

---

Développé avec ❤️ par **Yassoungo Diarrassouba** — Dernière mise à jour : Septembre 2026
