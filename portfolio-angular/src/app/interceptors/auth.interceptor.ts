import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';
import { catchError, throwError } from 'rxjs';

/**
 * Intercepteur HTTP global.
 * - Injecte automatiquement le token Bearer UNIQUEMENT sur les requêtes vers l'API.
 * - Ne l'envoie pas vers les fichiers statiques (i18n, assets) ni les domaines tiers.
 * - Gère les erreurs 401 (token expiré/invalide) en redirigeant vers /login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiService = inject(ApiService);
  const router = inject(Router);
  const token = apiService.getToken();

  // N'injecter le token que sur les requêtes destinées à notre API
  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const authReq = token && isApiRequest
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expiré ou invalide : nettoyage et redirection
        apiService.clearToken();
        router.navigateByUrl('/login');
      }
      return throwError(() => error);
    })
  );
};
