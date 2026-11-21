# 🅰️ Portfolio Angular — Frontend

> Application Angular 22 avec SSR (Server-Side Rendering)

[![Angular](https://img.shields.io/badge/Angular-22.0.8-dd0031?logo=angular)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![SSR](https://img.shields.io/badge/SSR-Enabled-brightgreen)](https://angular.dev/guide/ssr)

---

## 📌 Description

Frontend du portfolio de **Yassoungo Diarrassouba**, développé en **Angular 22** avec **Server-Side Rendering** activé. Utilise les Standalone Components, les Angular Signals et se connecte à une API Laravel via `environment.apiUrl`.

---

## ✨ Composants principaux

| Composant | Route | Description |
|---|---|---|
| `Hero` | `/` | Bannière d'accueil animée avec présentation |
| `About` | `/#about` | Bio + GitHub Stats + Timeline parcours |
| `Projects` | `/#projects` | Portfolio filtrable + carrousel Swiper.js |
| `Skills` | `/#skills` | Grille de compétences avec barres de progression |
| `NowPlaying` | `/#now` | Dernier commit GitHub en direct |
| `Blog` | `/blog` | Liste des articles |
| `BlogPost` | `/blog/:slug` | Article + système de commentaires |
| `Guestbook` | `/guestbook` | Livre d'or (connexion OAuth GitHub) |
| `MiniGame` | `/game` | Jeu interactif avec classement |
| `Company` | `/company` | Services professionnels |
| `CV` | `/cv` | Curriculum Vitae interactif + PDF |
| `Contact` | `/#contact` | Formulaire de contact |
| `AdminLogin` | `/login` | Authentification admin |
| `AdminDashboard` | `/admin` | Panneau d'administration complet |
| `Chatbot` | Global | Bulle de chat IA (Gemini) persistante |

---

## 🛠️ Technologies

- **Angular 22.0.8** — Standalone Components, Signals, SSR (`@angular/ssr`)
- **TypeScript 6** — Typage strict
- **RxJS 7** — Gestion des flux de données
- **Swiper.js 14** — Carrousels
- **CSS3 Vanilla** — Glassmorphism, animations, variables CSS
- **Font Awesome** — Icônes vectorielles
- **Google Fonts (Poppins)** — Typographie
- **Vitest** — Tests unitaires

---

## 🗂️ Structure

```text
src/
├── app/
│   ├── components/
│   │   ├── about/              # À propos + GitHub + Timeline
│   │   ├── admin-dashboard/    # Admin (CRUD complet)
│   │   ├── admin-login/        # Page de connexion admin
│   │   ├── blog/               # Liste des articles
│   │   ├── blog-post/          # Article individuel + commentaires
│   │   ├── chatbot/            # Chat IA Gemini (bulle flottante)
│   │   ├── company/            # Services professionnels
│   │   ├── contact/            # Formulaire de contact
│   │   ├── cv/                 # CV interactif
│   │   ├── footer/             # Footer + Newsletter
│   │   ├── guestbook/          # Livre d'or OAuth
│   │   ├── mini-game/          # Jeu interactif
│   │   ├── navbar/             # Barre de navigation
│   │   ├── now-playing/        # Activité GitHub live
│   │   ├── projects/           # Projets filtrables
│   │   └── skills/             # Grille de compétences
│   ├── services/
│   │   ├── api.service.ts      # Tous les appels HTTP vers le backend
│   │   ├── github.ts           # Cache stats GitHub (SSR-safe)
│   │   ├── theme.service.ts    # Dark/Light mode
│   │   └── translation.service.ts  # i18n FR/EN
│   ├── animations.ts           # Animations de routage
│   ├── app.html                # Template racine
│   ├── app.routes.ts           # Définition des routes
│   └── app.ts                  # Composant racine (SSR + curseur + reveal)
├── environments/
│   ├── environment.ts          # Dev (localhost:8000)
│   └── environment.prod.ts     # Production
├── server.ts                   # Serveur Express pour SSR
└── index.html                  # Point d'entrée HTML
```

---

## 🚀 Installation

### Prérequis
- Node.js `v22.22.3+` ou `v24.15.0+`
- npm `10+`

### Lancement

```bash
# Installer les dépendances
npm install --legacy-peer-deps

# Serveur de développement (http://localhost:4200)
npm run start

# Build de production
npm run build

# Lancer le serveur SSR en production
node dist/portfolio-angular/server/server.mjs
```

> ⚠️ Le backend Laravel doit tourner sur `http://localhost:8000` en développement.

---

## ⚙️ Variables d'environnement Angular

Modifier `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

---

## 🔑 Fonctionnalités SSR

Le SSR est activé via `@angular/ssr`. Points importants :
- Toutes les utilisations de `localStorage`, `window`, `document` sont guardées par `isPlatformBrowser()`
- Le serveur Express dans `src/server.ts` gère le pré-rendu
- Les balises meta dynamiques sont injectées via `@angular/platform-browser`

---

## 🎨 Design System

Variables CSS globales (dans `public/Assets/css/style.css`) :

```css
--accent-blue: #3b82f6;
--accent-purple: #8b5cf6;
--accent-cyan: #06b6d4;
--bg: #0a0a1a;
--bg-section: #0f0f23;
--glass: rgba(255,255,255,0.05);
```

---

Développé avec ❤️ par **Yassoungo Diarrassouba** — Septembre 2026
