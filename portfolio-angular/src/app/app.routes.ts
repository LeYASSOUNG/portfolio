import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

/**
 * Configuration globale des routes de la Single Page Application (SPA).
 * Toutes les routes utilisent le lazy loading (loadComponent) pour le code splitting.
 * Angular ne charge le bundle d'une page que quand l'utilisateur y navigue.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then(m => m.Home),
    data: { animation: 'HomePage' },
  }, // Page d'accueil par défaut (le portfolio central)
  {
    path: 'cv',
    loadComponent: () => import('./components/cv/cv').then(m => m.Cv),
    data: { animation: 'CvPage' },
  }, // Page du profil complet CV
  {
    path: 'blog',
    loadComponent: () => import('./components/blog/blog').then(m => m.Blog),
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./components/blog-post/blog-post').then(m => m.BlogPost),
  },
  {
    path: 'guestbook',
    loadComponent: () => import('./components/guestbook/guestbook').then(m => m.Guestbook),
  },
  {
    path: 'login',
    loadComponent: () => import('./components/admin-login/admin-login').then(m => m.AdminLogin),
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found').then(m => m.NotFound),
  }, // Page 404 personnalisée
];
