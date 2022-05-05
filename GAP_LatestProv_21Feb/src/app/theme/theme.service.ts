import { Injectable, Inject, EventEmitter } from '@angular/core';
import { THEMES, ACTIVE_THEME, Theme } from './symbols';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  themeChange = new EventEmitter<Theme>();

  constructor(@Inject(THEMES) public themes: Theme[],
              @Inject(ACTIVE_THEME) public theme: string) { }

  getActiveTheme() {
    if (localStorage.getItem('theme')) {
      this.theme = localStorage.getItem('theme');
    }
    const theme = this.themes.find(t => t.name === this.theme);
    if (!theme) {
      throw new Error(`Theme not found: '${this.theme}'`);
    }
    return theme;
  }

  setTheme(name: string) {
    this.theme = name;
    localStorage.setItem('theme', name);
    this.themeChange.emit( this.getActiveTheme());
  }
}
