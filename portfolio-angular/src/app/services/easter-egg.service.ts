import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EasterEggService {
  isUnlocked = signal<boolean>(false);

  unlock() {
    this.isUnlocked.set(true);
    setTimeout(() => {
      document.getElementById('game')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  }
}
