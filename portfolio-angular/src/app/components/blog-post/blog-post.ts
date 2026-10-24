import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { SeoService } from '../../services/seo.service';
import { marked } from 'marked';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [DatePipe, RouterModule, FormsModule, Navbar, Footer],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css'
})
export class BlogPost implements OnInit {
  article = signal<any>(null);
  comments = signal<any[]>([]);
  
  newComment = { author: '', content: '' };
  commentStatus = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private seo: SeoService
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.apiService.getArticle(slug).subscribe(data => {
        // Setup SEO
        const contentStr = data.content || '';
        const snippet = contentStr.length > 150 ? contentStr.substring(0, 150) + '...' : contentStr;
        this.seo.setStandardMetaAndOpenGraph(
          data.title + ' - Yassoungo Diarrassouba',
          snippet,
          data.image || 'Assets/images/default-og.png'
        );

        data.content = marked.parse(contentStr) as string;
        this.article.set(data);

        this.loadComments(data.id);
      });
    }
  }

  loadComments(articleId: number) {
    this.apiService.getComments(articleId).subscribe(data => this.comments.set(data));
  }

  submitComment(event: Event) {
    event.preventDefault();
    if (!this.newComment.author || !this.newComment.content) return;

    this.apiService.postComment(this.article().id, this.newComment.author, this.newComment.content).subscribe({
      next: () => {
        this.commentStatus = 'Votre commentaire a été envoyé et est en attente de modération.';
        this.newComment = { author: '', content: '' };
        setTimeout(() => this.commentStatus = '', 5000);
      },
      error: () => {
        this.commentStatus = 'Erreur lors de l\'envoi du commentaire.';
      }
    });
  }
}
