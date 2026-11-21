import { Component, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-skills',
  imports: [NgClass],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills implements OnInit {
  skills = signal<any[]>([]);

  constructor(
    public translation: TranslationService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.apiService.getSkills().subscribe((data) => {
      this.skills.set(data);
    });
  }

  getCategoryColor(category: string): string {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('front')) return 'fill-blue';
    if (cat.includes('back')) return 'fill-green';
    if (cat.includes('donn') || cat.includes('database')) return 'fill-cyan';
    if (cat.includes('outil') || cat.includes('devops')) return 'fill-purple';
    if (cat.includes('ui') || cat.includes('ux') || cat.includes('design')) return 'fill-yellow';
    return 'fill-blue';
  }
}
