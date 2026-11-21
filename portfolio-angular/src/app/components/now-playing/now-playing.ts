import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-now-playing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './now-playing.html',
  styleUrl: './now-playing.css',
})
export class NowPlaying implements OnInit {
  github = signal<any>(null);
  spotify = signal<any>(null);
  loading = signal(true);

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getNow().subscribe({
      next: (data) => {
        this.github.set(data.github);
        this.spotify.set(data.spotify);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  timeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'à l\'instant';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `il y a ${days}j`;
  }
}
