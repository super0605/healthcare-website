import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './theme.service';

@NgModule({
  imports: [CommonModule]
})
export class SharedThemeModule {}

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [ThemeService]
})
export class ThemeModule {}
