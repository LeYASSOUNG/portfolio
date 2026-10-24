import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { catchError, throwError } from 'rxjs';

/**
 * Intercepteur HTTP global.
 * - Injecte automatiquement le token Bearer sur chaque requête (admin_token ou auth_token).
 * - Gère les erreurs 401 (token expiré/invalide) en redirigeant vers /login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiService = inject(ApiService);
  const router = inject(Router);
  const token = apiService.getToken();

  const authReq = token
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
