import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from '@medopad/clinician-app/routes';
import {
  IconsProviderModule,
  LanguageProviderModule
} from '@medopad/clinician-app/providers';
import { locales } from '@medopad/clinician-app/locales';

// #region Startup Service
import { StartupService, API_ENDPOINTS } from '@medopad/clinician-app/services';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

export function StartupServiceFactory(startupService: StartupService) {
  return () => startupService.initialize(API_ENDPOINTS);
}

console.log('APP MIN ==>API_ENDPOINTS', API_ENDPOINTS);
const APPINIT_PROVIDES = [
  StartupService,
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true
  }
];
// #endregion

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    IconsProviderModule,
    LanguageProviderModule,
    /**
     * Routing Module
     */
    AppRoutingModule,
    StoreModule.forRoot(
      {},
      {
        metaReducers: !environment.production ? [] : [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true
        }
      }
    ),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [...APPINIT_PROVIDES],
  bootstrap: [AppComponent]
})
export class AppModule {}
