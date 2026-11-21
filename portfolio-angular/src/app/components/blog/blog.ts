import { Component, OnInit, signal, computed } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [DatePipe, RouterModule, Navbar, Footer],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class Blog implements OnInit {
  articles = signal<any[]>([]);
  currentPage = signal(1);
  itemsPerPage = 6;

  paginatedArticles = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.articles().slice(start, start + this.itemsPerPage);
  });

  totalPages = computed(() => {
    return Math.ceil(this.articles().length / this.itemsPerPage);
  });

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getArticles().subscribe(data => {
      // Afficher uniquement les articles publiés sur le site public
      const published = data.filter((a: any) => a.is_published);
      this.articles.set(published);
    });
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
