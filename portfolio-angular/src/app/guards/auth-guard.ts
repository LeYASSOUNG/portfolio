import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { catchError, map, of } from 'rxjs';

/**
 * Guard de route pour l'admin.
 * Vérifie d'abord la présence du token localement, puis le valide côté serveur
 * via /api/user pour s'assurer qu'il n'est pas expiré ou révoqué.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  // Pas de token stocké ? Redirection immédiate
  if (!apiService.getToken()) {
    return router.parseUrl('/login');
  }

  // Validation côté serveur : token valide ET capacité "admin" (un token livre d'or ne suffit pas)
  return apiService.getUser().pipe(
    map((user) => user.is_admin ? true : router.parseUrl('/login')),
    catchError(() => {
      apiService.clearToken();
      return of(router.parseUrl('/login'));
    })
  );
};
