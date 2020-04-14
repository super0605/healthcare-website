import { Injectable } from '@angular/core';
import { Theme } from './theme-types';
import defaultTheme from './themes/theme1';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  setDefaultTheme(): void {
    this.setTheme(defaultTheme);
  }

  setTheme(theme: Theme): void {
    document.querySelector('body').classList.add('theme__' + theme.name);
    (window as any).less.modifyVars(theme.variables);
  }
}
