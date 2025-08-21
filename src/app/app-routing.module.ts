import { Routes } from '@angular/router';
import { FilmsResolver } from './features/films/resolvers/films.resolver';
import { FilmRelationsResolver } from './features/films/resolvers/film-relations.resolver';

export const appRoutes: Routes = [
  {
    path: 'films',
    loadComponent: () =>
      import('./features/films/pages/films-list.component').then( m => m.FilmsListComponent ),
    resolve: { films: FilmsResolver }
  },
  {
    path: 'films/:id',
    loadComponent: () =>
      import('./features/films/pages/film-detail.component').then( m => m.FilmDetailComponent ),
    resolve: { films: FilmsResolver, relations: FilmRelationsResolver }   
  },
  { 
    path: 'films/:id/characters/:characterId',
    loadComponent: () =>
      import('./features/characters/pages/character-detail.component').then( m => m.CharacterDetailComponent)
  },
  { path: '', redirectTo: 'films', pathMatch: 'full' }
];