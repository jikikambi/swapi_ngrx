import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'; 

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { appReducer } from './app/store/app.reducer';
import { metaReducers } from './app/store/meta-reducers';
import { FilmsEffects } from './app/features/films/store/films.effects';

import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { HttpUrlGenerator, provideEntityData, withEffects } from '@ngrx/data';
import { customDataServices, entityConfig } from './app/entity-metadata';
import { appRoutes } from './app/app-routing.module';

import { SwapiHttpUrlGenerator } from './app/store/swapi-http-url-generator';

import 'zone.js';

import * as fromFilms from './app/features/films/store/films.reducer';
import { provideCustomDataServices } from './app/shared/utils/provide-custom-data-services';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideAnimations(),

    // Core Angular providers
    provideHttpClient(),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),

    // NgRx Store setup
    provideStore(
      {
        ...appReducer,
        [fromFilms.filmsFeatureKey]: fromFilms.reducer
      },
      { metaReducers }
    ),

    // Register effects directly with NgRx
    provideEffects([FilmsEffects]),

    // NgRx Data setup
    provideEntityData(entityConfig, withEffects()),
    { provide: HttpUrlGenerator, useClass: SwapiHttpUrlGenerator },

    // Register all DataServices dynamically
    provideCustomDataServices(customDataServices),

    // DevTools
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    })
  ]
}).catch(err => console.error(err));
