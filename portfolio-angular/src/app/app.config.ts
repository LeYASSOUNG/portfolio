import { ApplicationConfig, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './interceptors/auth.interceptor';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideClientHydration } from '@angular/platform-browser';

/**
 * Configuration centrale des Providers pour l'application Angular.
 * Cet objet remplace l'ancien concept des "NgModules" (providers: []).
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Moteur Zoneless (meilleures performances)
    provideZonelessChangeDetection(),

    // Animations asynchrones (bundle allégé)
    provideAnimationsAsync(),

    // Routage SPA
    provideRouter(routes),

    // PWA Service Worker (actif en production uniquement)
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),

    // Client HTTP pour récupérer les fichiers JSON de traduction et l'API
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ), provideClientHydration(),
  ],
};
