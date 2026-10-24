import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { TranslationService } from '../../services/translation.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-guestbook',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guestbook.html',
  styleUrl: './guestbook.css'
})
export class Guestbook implements OnInit {
  entries = signal<any[]>([]);
  newMessage = signal('');
  isSubmitting = signal(false);
  isAuthenticated = signal(false);
  user = signal<any>(null);

  constructor(
    private apiService: ApiService,
    public translation: TranslationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAuth();
    this.loadEntries();
  }

  checkAuth() {
    // Check if token is in URL (from OAuth redirect)
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('auth_token', params['token']);
        }
        // Clean URL
        this.router.navigate([], { queryParams: { token: null }, queryParamsHandling: 'merge' });
        this.isAuthenticated.set(true);
        this.fetchUser();
      } else if (typeof localStorage !== 'undefined' && (localStorage.getItem('auth_token') || localStorage.getItem('admin_token'))) {
        this.isAuthenticated.set(true);
        this.fetchUser();
      }
    });
  }

  fetchUser() {
    this.apiService.getUser().subscribe({
      next: (user) => this.user.set(user),
      error: () => {
        this.logout();
      }
    });
  }

  loadEntries() {
    this.apiService.getGuestbookEntries().subscribe({
      next: (data) => this.entries.set(data),
      error: (err) => console.error('Error loading guestbook', err)
    });
  }

  loginWithGithub() {
    window.location.href = `${environment.apiUrl}/auth/github/redirect`;
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    this.isAuthenticated.set(false);
  }

  submitMessage() {
    if (!this.newMessage().trim()) return;
    this.isSubmitting.set(true);

    this.apiService.postGuestbookEntry(this.newMessage()).subscribe({
      next: (entry) => {
        this.entries.update(entries => [entry, ...entries]);
        this.newMessage.set('');
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Error posting message', err);
        this.isSubmitting.set(false);
      }
    });
  }
}
