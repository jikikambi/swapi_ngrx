// src/app/features/films/films.routes.ts
import { Routes } from '@angular/router';
import { FilmsListComponent } from './pages/films-list.component';
import { FilmDetailComponent } from './pages/film-detail.component';
import { FilmsResolver } from './resolvers/films.resolver';

export const filmsRoutes: Routes = [
  {
    path: '',
    component: FilmsListComponent,
    resolve: { films: FilmsResolver }
  },
  {
    path: ':id',
    component: FilmDetailComponent,
    resolve: { film: FilmsResolver } // can be same or different resolver
  }
];
