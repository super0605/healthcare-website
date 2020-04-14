import { NgModule, LOCALE_ID } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Locale Registration
 */
import { registerLocaleData } from '@angular/common';
import { default as localeEn } from '@angular/common/locales/en';
import { NZ_I18N, en_US as localeZorro } from '@medopad/shared/mpui';

registerLocaleData(localeEn, 'en');

@NgModule({
  imports: [TranslateModule.forRoot()],
  providers: [
    { provide: LOCALE_ID, useValue: 'en' },
    { provide: NZ_I18N, useValue: localeZorro }
  ]
})
export class LanguageProviderModule {}
