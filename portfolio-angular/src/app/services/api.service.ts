import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import {
  Project, Skill, Experience, Article, Comment, Message,
  Score, Setting, GuestbookEntry, Testimonial, CompanyService,
  Subscriber, GithubStats, NowData, ChatResponse, ChatHistoryItem, AuthToken,
  SeoEntry, MediaItem
} from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private storage: StorageService) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`);
  }

  addProject(data: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects`, data);
  }

  updateProject(id: number, data: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/projects/${id}`, data);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${id}`);
  }

  getExperiences(): Observable<Experience[]> {
    return this.http.get<Experience[]>(`${this.apiUrl}/experiences`);
  }

  addExperience(data: Partial<Experience>): Observable<Experience> {
    return this.http.post<Experience>(`${this.apiUrl}/experiences`, data);
  }

  updateExperience(id: number, data: Partial<Experience>): Observable<Experience> {
    return this.http.put<Experience>(`${this.apiUrl}/experiences/${id}`, data);
  }

  deleteExperience(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/experiences/${id}`);
  }

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiUrl}/skills`);
  }

  addSkill(data: Partial<Skill>): Observable<Skill> {
    return this.http.post<Skill>(`${this.apiUrl}/skills`, data);
  }

  updateSkill(id: number, data: Partial<Skill>): Observable<Skill> {
    return this.http.put<Skill>(`${this.apiUrl}/skills/${id}`, data);
  }

  deleteSkill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/skills/${id}`);
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages`);
  }

  sendMessage(data: Partial<Message>): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/messages`, data);
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/messages/${id}`);
  }

  updateCredentials(data: { email?: string; password?: string }): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/user/credentials`, data);
  }

  // Scores du mini-jeu
  getScores(): Observable<Score[]> {
    return this.http.get<Score[]>(`${this.apiUrl}/scores`);
  }

  saveScore(data: Omit<Score, 'id' | 'created_at'>): Observable<Score> {
    return this.http.post<Score>(`${this.apiUrl}/scores`, data);
  }

  // Statistiques
  getStats(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/stats`);
  }

  recordVisit(page: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/visits`, { page });
  }

  // Articles (Blog)
  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/articles`);
  }

  getArticle(slug: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/articles/${slug}`);
  }

  addArticle(data: Partial<Article>): Observable<Article> {
    return this.http.post<Article>(`${this.apiUrl}/articles`, data);
  }

  updateArticle(id: number, data: Partial<Article>): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/articles/${id}`, data);
  }

  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/articles/${id}`);
  }

  // Settings
  getSettings(): Observable<Setting> {
    return this.http.get<Setting>(`${this.apiUrl}/settings`).pipe(
      catchError(() => of({} as Setting))
    );
  }

  updateSettings(data: Partial<Setting>): Observable<Setting> {
    return this.http.post<Setting>(`${this.apiUrl}/settings`, data);
  }

  // Company Services
  getCompanyServices(): Observable<CompanyService[]> {
    return this.http.get<CompanyService[]>(`${this.apiUrl}/company-services`);
  }

  addCompanyService(data: Partial<CompanyService>): Observable<CompanyService> {
    return this.http.post<CompanyService>(`${this.apiUrl}/company-services`, data);
  }

  updateCompanyService(id: number, data: Partial<CompanyService>): Observable<CompanyService> {
    return this.http.put<CompanyService>(`${this.apiUrl}/company-services/${id}`, data);
  }

  deleteCompanyService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/company-services/${id}`);
  }

  // Messages extra
  replyToMessage(id: number, reply: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/messages/${id}/reply`, { reply });
  }

  // Scores extra
  deleteScore(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/scores/${id}`);
  }

  // Auth Admin
  login(credentials: { email: string; password: string }): Observable<AuthToken> {
    return this.http.post<AuthToken>(`${this.apiUrl}/login`, credentials);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {});
  }

  getToken(): string | null {
    return this.storage.get('admin_token') ?? this.storage.get('auth_token');
  }

  setToken(token: string): void {
    this.storage.set('admin_token', token);
  }

  clearToken(): void {
    this.storage.remove('admin_token');
  }

  // === NOUVELLES FONCTIONNALITÉS ===
  // Analytics
  trackView(page_url: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/analytics/track`, { page_url }).pipe(
      catchError(() => of(undefined as void))
    );
  }
  getAdminAnalytics(): Observable<Record<string, unknown>[]> {
    return this.http.get<Record<string, unknown>[]>(`${this.apiUrl}/admin/analytics`);
  }

  // Newsletter
  subscribeNewsletter(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/subscribe`, { email });
  }
  getAdminSubscribers(): Observable<Subscriber[]> {
    return this.http.get<Subscriber[]>(`${this.apiUrl}/admin/subscribers`);
  }
  deleteSubscriber(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/subscribers/${id}`);
  }
  sendNewsletter(data: { subject: string, body: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/admin/newsletter/send`, data);
  }

  // Commentaires
  getComments(article_id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/articles/${article_id}/comments`);
  }
  postComment(article_id: number, author: string, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/articles/${article_id}/comments`, { article_id, author, content });
  }
  getAdminComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/admin/comments`);
  }
  updateCommentStatus(id: number, status: Comment['status']): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/admin/comments/${id}`, { status });
  }
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/comments/${id}`);
  }

  // Témoignages
  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.apiUrl}/testimonials`);
  }
  getAdminTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.apiUrl}/testimonials`);
  }
  addTestimonial(data: Partial<Testimonial>): Observable<Testimonial> {
    return this.http.post<Testimonial>(`${this.apiUrl}/testimonials`, data);
  }
  updateTestimonial(id: number, data: Partial<Testimonial>): Observable<Testimonial> {
    return this.http.put<Testimonial>(`${this.apiUrl}/testimonials/${id}`, data);
  }
  deleteTestimonial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/testimonials/${id}`);
  }

  // Sauvegarde
  downloadBackup(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/admin/backup`, {
      responseType: 'blob'
    });
  }

  // SEO
  getSeo(): Observable<SeoEntry[]> {
    return this.http.get<SeoEntry[]>(`${this.apiUrl}/seo`);
  }
  updateSeo(seos: SeoEntry[]): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${this.apiUrl}/admin/seo`, { seos });
  }

  // GitHub Stats
  getGithubStats(): Observable<GithubStats> {
    return this.http.get<GithubStats>(`${this.apiUrl}/github/stats`);
  }

  // Guestbook & Auth
  getUser(): Observable<{ id: number; name: string; email: string; is_admin: boolean }> {
    return this.http.get<{ id: number; name: string; email: string; is_admin: boolean }>(`${this.apiUrl}/user`);
  }

  getGuestbookEntries(): Observable<GuestbookEntry[]> {
    return this.http.get<GuestbookEntry[]>(`${this.apiUrl}/guestbook`);
  }

  postGuestbookEntry(message: string): Observable<GuestbookEntry> {
    return this.http.post<GuestbookEntry>(`${this.apiUrl}/guestbook`, { message });
  }

  // Now (GitHub + Spotify)
  getNow(): Observable<NowData> {
    return this.http.get<NowData>(`${this.apiUrl}/now`);
  }

  // Chatbot IA
  chat(message: string, history: ChatHistoryItem[] = []): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiUrl}/chat`, { message, history });
  }

  // Media Manager
  getMedia(folder: string = 'uploads'): Observable<MediaItem[]> {
    const params = new HttpParams().set('folder', folder);
    return this.http.get<MediaItem[]>(`${this.apiUrl}/admin/media`, { params });
  }

  uploadMedia(file: File, folder: string = 'uploads'): Observable<MediaItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return this.http.post<MediaItem>(`${this.apiUrl}/admin/media`, formData);
  }

  createFolder(name: string, parentFolder: string = 'uploads'): Observable<MediaItem> {
    return this.http.post<MediaItem>(`${this.apiUrl}/admin/media/create-folder`, { name, folder: parentFolder });
  }

  deleteMedia(path: string): Observable<void> {
    const params = new HttpParams().set('path', path);
    return this.http.delete<void>(`${this.apiUrl}/admin/media`, { params });
  }
}
