import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company.html',
  styleUrl: './company.css',
})
export class Company implements OnInit {
  experiences = signal<any[]>([]);
  settings = signal<any>({});
  services = signal<any[]>([]);
  testimonials = signal<any[]>([]);

  constructor(
    public translation: TranslationService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.apiService.getSettings().subscribe((data) => this.settings.set(data));
    this.apiService.getCompanyServices().subscribe((data) => this.services.set(data));
    this.apiService.getTestimonials().subscribe((data) => this.testimonials.set(data));
  }
}
