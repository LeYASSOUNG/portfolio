import { Injectable } from '@angular/core';

/**
 * Service centralise pour l'acces au localStorage.
 * - Garantit la compatibilite SSR (aucun acces au DOM cote serveur)
 * - Facilite les tests unitaires (mockable facilement)
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private get available(): boolean {
    return typeof localStorage !== 'undefined';
  }

  get(key: string): string | null {
    return this.available ? localStorage.getItem(key) : null;
  }

  set(key: string, value: string): void {
    if (this.available) {
      localStorage.setItem(key, value);
    }
  }

  remove(key: string): void {
    if (this.available) {
      localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (this.available) {
      localStorage.clear();
    }
  }
}
