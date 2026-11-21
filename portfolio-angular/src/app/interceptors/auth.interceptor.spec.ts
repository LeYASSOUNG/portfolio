import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authInterceptor } from './auth.interceptor';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';

describe('authInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;
  let api: { getToken: ReturnType<typeof vi.fn>; clearToken: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(() => {
    api = { getToken: vi.fn().mockReturnValue('secret'), clearToken: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: ApiService, useValue: api },
      ],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => ctrl.verify());

  it('ajoute le Bearer sur les requêtes vers l\'API', () => {
    http.get(`${environment.apiUrl}/projects`).subscribe();
    const req = ctrl.expectOne(`${environment.apiUrl}/projects`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer secret');
    req.flush([]);
  });

  it('n\'envoie PAS le token vers un domaine tiers ni les assets', () => {
    http.get('https://api.github.com/users/x').subscribe();
    http.get('/Assets/i18n/fr.json').subscribe();
    const a = ctrl.expectOne('https://api.github.com/users/x');
    const b = ctrl.expectOne('/Assets/i18n/fr.json');
    expect(a.request.headers.has('Authorization')).toBe(false);
    expect(b.request.headers.has('Authorization')).toBe(false);
    a.flush({});
    b.flush({});
  });

  it('sans token, n\'ajoute aucun en-tête', () => {
    api.getToken.mockReturnValue(null);
    http.get(`${environment.apiUrl}/projects`).subscribe();
    const req = ctrl.expectOne(`${environment.apiUrl}/projects`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });

  it('sur 401 : efface le token et redirige vers /login', () => {
    const nav = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    http.get(`${environment.apiUrl}/user`).subscribe({ error: () => undefined });
    ctrl.expectOne(`${environment.apiUrl}/user`).flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(api.clearToken).toHaveBeenCalled();
    expect(nav).toHaveBeenCalledWith('/login');
  });

  it('sur 500 : ne touche pas au token', () => {
    http.get(`${environment.apiUrl}/projects`).subscribe({ error: () => undefined });
    ctrl.expectOne(`${environment.apiUrl}/projects`).flush({}, { status: 500, statusText: 'Server Error' });
    expect(api.clearToken).not.toHaveBeenCalled();
  });
});
