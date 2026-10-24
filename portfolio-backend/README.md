# ⚙️ Portfolio Backend — API Laravel 12

> API REST du portfolio — Laravel 12 + PostgreSQL + Sanctum

[![Laravel](https://img.shields.io/badge/Laravel-12-ff2d20?logo=laravel)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.2-777bb4?logo=php)](https://www.php.net)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?logo=postgresql)](https://www.postgresql.org)
[![Sanctum](https://img.shields.io/badge/Auth-Sanctum-ff6900)](https://laravel.com/docs/sanctum)

---

## 📌 Description

API REST Laravel alimentant le portfolio de **Yassoungo Diarrassouba**. Gère les contenus dynamiques (projets, compétences, expériences, articles, etc.), l'authentification admin, le chatbot IA, les statistiques et les intégrations tierces (GitHub OAuth, Gemini AI).

---

## 🔌 Endpoints API

### Publics

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/projects` | Liste des projets |
| `GET` | `/api/projects/{id}` | Détail d'un projet |
| `GET` | `/api/skills` | Liste des compétences |
| `GET` | `/api/experiences` | Parcours académique/professionnel |
| `GET` | `/api/articles` | Liste des articles |
| `GET` | `/api/articles/{slug}` | Article individuel |
| `GET` | `/api/articles/{id}/comments` | Commentaires d'un article |
| `POST` | `/api/articles/{id}/comments` | Poster un commentaire |
| `GET` | `/api/testimonials` | Témoignages |
| `GET` | `/api/settings` | Paramètres publics |
| `GET` | `/api/company-services` | Services professionnels |
| `GET` | `/api/scores` | Classement du mini-jeu |
| `POST` | `/api/scores` | Enregistrer un score |
| `GET` | `/api/guestbook` | Entrées du livre d'or |
| `GET` | `/api/github/stats` | Stats GitHub (profil + top repos) |
| `GET` | `/api/now` | Dernier commit GitHub (Now Playing) |
| `GET` | `/api/cv/download` | Télécharger le CV en PDF |
| `POST` | `/api/messages` | Envoyer un message de contact |
| `POST` | `/api/subscribe` | S'abonner à la newsletter |
| `POST` | `/api/analytics/track` | Tracker une visite |
| `POST` | `/api/chat` | Chatbot IA (Gemini Flash) |
| `POST` | `/api/visits` | Enregistrer une visite |
| `POST` | `/api/login` | Authentification admin |
| `GET` | `/api/auth/github/redirect` | OAuth GitHub (redirect) |
| `GET` | `/api/auth/github/callback` | OAuth GitHub (callback) |

### Protégés (Bearer Token — Admin)

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/logout` | Déconnexion |
| `GET` | `/api/user` | Utilisateur connecté |
| `PUT` | `/api/user/credentials` | Changer email/mot de passe |
| `POST/PUT/DELETE` | `/api/projects` | CRUD projets |
| `POST/PUT/DELETE` | `/api/experiences` | CRUD parcours |
| `POST/PUT/DELETE` | `/api/skills` | CRUD compétences |
| `GET/DELETE` | `/api/messages` | Gestion des messages |
| `POST` | `/api/messages/{id}/reply` | Répondre à un message |
| `POST/PUT/DELETE` | `/api/articles` | CRUD articles (déclenche newsletter) |
| `POST/PUT/DELETE` | `/api/testimonials` | CRUD témoignages |
| `POST/PUT/DELETE` | `/api/company-services` | CRUD services |
| `POST` | `/api/settings` | Mettre à jour les paramètres |
| `POST` | `/api/guestbook` | Poster dans le livre d'or |
| `GET` | `/api/admin/analytics` | Statistiques de visite |
| `GET/DELETE` | `/api/admin/subscribers` | Gestion des abonnés |
| `GET/PUT/DELETE` | `/api/admin/comments` | Modération des commentaires |
| `DELETE` | `/api/scores/{id}` | Supprimer un score |
| `GET` | `/api/admin/backup` | Export JSON de la base |
| `GET` | `/api/stats` | Statistiques admin |

---

## 🗂️ Structure

```text
app/
├── Events/
│   └── ArticlePublished.php        # Événement lors de la publication d'un article
├── Listeners/
│   └── SendNewsletterToSubscribers.php  # Envoi auto de la newsletter
├── Mail/
│   └── NewsletterEmail.php         # Email de newsletter (Mailable)
├── Http/Controllers/Api/
│   ├── AnalyticsController.php     # Tracking + stats de pages
│   ├── ArticleController.php       # Blog (déclenche ArticlePublished)
│   ├── AuthController.php          # Login / Logout / Credentials
│   ├── ChatController.php          # Proxy Gemini Flash IA
│   ├── CommentController.php       # Commentaires d'articles
│   ├── CompanyServiceController.php
│   ├── CvController.php            # Téléchargement PDF du CV
│   ├── ExperienceController.php    # Parcours
│   ├── GithubController.php        # Stats profil + Now Playing
│   ├── GuestbookController.php     # Livre d'or
│   ├── MessageController.php       # Formulaire de contact
│   ├── ProjectController.php       # Projets
│   ├── SettingController.php       # Paramètres + Backup
│   ├── SkillController.php         # Compétences
│   ├── SocialAuthController.php    # OAuth GitHub (Socialite)
│   ├── StatsController.php         # Statistiques globales
│   ├── SubscriberController.php    # Newsletter
│   └── TestimonialController.php   # Témoignages
└── Models/
    ├── Article.php
    ├── Comment.php
    ├── CompanyService.php
    ├── Experience.php
    ├── GuestbookEntry.php
    ├── Message.php
    ├── PageView.php
    ├── Project.php
    ├── Score.php
    ├── Setting.php
    ├── Skill.php
    ├── Subscriber.php
    ├── Testimonial.php
    ├── User.php
    └── Visit.php
```

---

## 🚀 Installation

### Prérequis
- PHP `8.2+`
- Composer `2+`
- PostgreSQL `16+`

### Étapes

```bash
# 1. Installer les dépendances
composer install

# 2. Copier et configurer l'environnement
cp .env.example .env

# 3. Générer la clé applicative
php artisan key:generate

# 4. Exécuter les migrations
php artisan migrate

# 5. (Optionnel) Remplir avec des données de départ
php artisan db:seed

# 6. Lancer le serveur de développement
php artisan serve   # → http://localhost:8000
```

---

## ⚙️ Variables d'environnement (`.env`)

```env
APP_NAME=Portfolio
APP_ENV=local
APP_KEY=
APP_URL=http://localhost:8000

# Base de données
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=portfolio
DB_USERNAME=postgres
DB_PASSWORD=

# Frontend (CORS)
FRONTEND_URL=http://localhost:4200

# GitHub OAuth (Livre d'or)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URI=http://localhost:8000/api/auth/github/callback

# Chatbot IA
GEMINI_API_KEY=

# Mail (Newsletter)
MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=
```

---

## 🗄️ Base de données

### Tables

| Table | Description |
|---|---|
| `users` | Admin + utilisateurs OAuth GitHub |
| `personal_access_tokens` | Tokens Sanctum |
| `projects` | Projets du portfolio |
| `experiences` | Parcours académique/professionnel |
| `skills` | Compétences techniques |
| `articles` | Articles de blog |
| `comments` | Commentaires modérés |
| `messages` | Messages de contact |
| `testimonials` | Témoignages |
| `company_services` | Services professionnels |
| `scores` | Classement du mini-jeu |
| `subscribers` | Abonnés newsletter |
| `guestbook_entries` | Livre d'or |
| `settings` | Paramètres de l'application |
| `visits` | Tracking des visites |
| `page_views` | Analytics détaillées |
| `jobs` / `cache` | Files d'attente Laravel |

---

## 🤖 Chatbot IA (Gemini)

Le `ChatController` utilise l'API **Gemini Flash** (Google DeepMind) :
- Récupère dynamiquement les projets, compétences et expériences depuis la DB
- Génère un prompt système contextuel
- Répond en tant qu'assistant personnel de **Yassoungo**
- Clé API configurée via `GEMINI_API_KEY` dans `.env`

---

## 📡 Intégrations tierces

| Service | Usage |
|---|---|
| **GitHub API** | Stats de profil, top repos, derniers commits |
| **GitHub OAuth** | Connexion pour le livre d'or |
| **Gemini Flash API** | Chatbot IA intelligent |
| **SMTP** | Envoi automatique de newsletters |

---

Développé avec ❤️ par **Yassoungo Diarrassouba** — Septembre 2026
