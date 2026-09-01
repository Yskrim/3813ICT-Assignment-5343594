import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

// base server url for every new request. 
export const apiURL = 'http://localhost:3000/api';

export const appConfig: ApplicationConfig = {
  providers: [
    // listen to browser
    provideBrowserGlobalErrorListeners(),
    // enable routing
    provideRouter(routes),
    // enable http client to send/receive requests
    provideHttpClient(),
  ]
};
