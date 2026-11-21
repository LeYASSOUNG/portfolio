import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, provideRouter } from '@angular/router';
import { Observable, of, throwError, firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authGuard } from './auth-guard';
import { ApiService } from '../services/api.service';

describe('authGuard', () => {
  let api: { getToken: ReturnType<typeof vi.fn>; getUser: ReturnType<typeof vi.fn>; clearToken: ReturnType<typeof vi.fn> };

  const run = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  beforeEach(() => {
    api = { getToken: vi.fn(), getUser: vi.fn(), clearToken: vi.fn() };
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: ApiService, useValue: api }],
    });
  });

  it('redirige vers /login sans token (sans appel serveur)', () => {
    api.getToken.mockReturnValue(null);
    const result = run() as UrlTree;
    expect(result.toString()).toBe('/login');
    expect(api.getUser).not.toHaveBeenCalled();
  });

  it('autorise un administrateur', async () => {
    api.getToken.mockReturnValue('tok');
    api.getUser.mockReturnValue(of({ id: 1, name: 'a', email: 'a@a.a', is_admin: true }));
    expect(await firstValueFrom(run() as Observable<boolean | UrlTree>)).toBe(true);
  });

  it('refuse un token non-admin (ex: livre d\'or)', async () => {
    api.getToken.mockReturnValue('tok');
    api.getUser.mockReturnValue(of({ id: 2, name: 'g', email: 'g@g.g', is_admin: false }));
    const result = (await firstValueFrom(run() as Observable<boolean | UrlTree>)) as UrlTree;
    expect(result.toString()).toBe('/login');
  });

  it('nettoie le token et redirige si le serveur répond en erreur', async () => {
    api.getToken.mockReturnValue('tok');
    api.getUser.mockReturnValue(throwError(() => new Error('401')));
    const result = (await firstValueFrom(run() as Observable<boolean | UrlTree>)) as UrlTree;
    expect(result.toString()).toBe('/login');
    expect(api.clearToken).toHaveBeenCalled();
  });
});
