import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _isDarkTheme = signal(true);

  constructor() {
    this.initTheme();
  }

  isDarkTheme(): boolean {
    return this._isDarkTheme();
  }

  private initTheme() {
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light') {
        this.setLightMode();
      } else {
        this.setDarkMode();
      }
    }
  }

  toggleTheme() {
    if (this._isDarkTheme()) {
      this.setLightMode();
    } else {
      this.setDarkMode();
    }
  }

  private setLightMode() {
    this._isDarkTheme.set(false);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', 'light');
    }
  }

  private setDarkMode() {
    this._isDarkTheme.set(true);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark');
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', 'dark');
    }
  }
}
