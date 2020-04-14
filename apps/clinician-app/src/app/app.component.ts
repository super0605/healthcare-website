import { Component, OnInit } from '@angular/core';
import { ThemeService } from '@medopad/shared/theme';
import { Theme } from '@medopad/shared/theme';
import darkTheme from '../assets/styles/themes/dark-theme';
import lightTheme from '../assets/styles/themes/light-theme';

@Component({
  selector: 'mp-clinician-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    console.log('darkTheme', darkTheme);
    this.setTheme(darkTheme);
    // this.setTheme(lightTheme);
  }

  setTheme(theme) {
    this.themeService.setTheme(theme);
  }
}
