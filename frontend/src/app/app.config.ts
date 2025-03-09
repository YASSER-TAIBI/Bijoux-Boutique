import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { authInterceptor } from './interceptors/auth.interceptor';

// Enregistrer la locale française
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ]
};
