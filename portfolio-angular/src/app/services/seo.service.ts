import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private title: Title, private meta: Meta) { }

  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateMetaTags(metaTags: { name: string; content: string }[]) {
    metaTags.forEach(tag => {
      this.meta.updateTag(tag);
    });
  }

  updateOpenGraph(ogTags: { property: string; content: string }[]) {
    ogTags.forEach(tag => {
      this.meta.updateTag(tag);
    });
  }

  setStandardMetaAndOpenGraph(title: string, description: string, image: string = 'Assets/images/default-og.png') {
    this.updateTitle(title);
    this.updateMetaTags([
      { name: 'description', content: description },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image }
    ]);
    this.updateOpenGraph([
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:type', content: 'website' }
    ]);
  }
}
