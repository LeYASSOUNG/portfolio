import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit {
  githubStats = signal<any>(null);
  experiences = signal<any[]>([]);
  apiUrl = environment.apiUrl;

  constructor(
    public translation: TranslationService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.apiService.getGithubStats().subscribe({
      next: (data) => {
        this.githubStats.set(data);
      },
      error: (err) => {
        console.error('Error fetching github stats', err);
      }
    });

    this.apiService.getExperiences().subscribe({
      next: (data) => {
        this.experiences.set(data);
      },
      error: (err) => {
        console.error('Error fetching experiences', err);
      }
    });
  }
}
