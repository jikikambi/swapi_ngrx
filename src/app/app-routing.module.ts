import { Routes } from '@angular/router';
import { FilmsResolver } from './features/films/resolvers/films.resolver';
import { FilmRelationsResolver } from './features/films/resolvers/film-relations.resolver';

export const appRoutes: Routes = [
  // // Most specific: Starship detail under a character
  // {
  //   path: 'films/:id/characters/:characterId/starships/:starshipId',
  //   loadComponent: () =>
  //     import('./features/starships/pages/starship-detail.component').then(m => m.StarshipDetailComponent)
  // },

  // // Starship detail under a film (not under a character)
  // {
  //   path: 'films/:id/starships/:starshipId',
  //   loadComponent: () =>
  //     import('./features/starships/pages/starship-detail.component').then(m => m.StarshipDetailComponent)
  // },

  // Character detail under a film
  {
    path: 'films/:id/characters/:characterId',
    loadComponent: () =>
      import('./features/characters/pages/character-detail.component').then(m => m.CharacterDetailComponent)
  },

  // Film detail
  {
    path: 'films/:id',
    loadComponent: () =>
      import('./features/films/pages/film-detail.component').then(m => m.FilmDetailComponent),
    resolve: { films: FilmsResolver, relations: FilmRelationsResolver }
  },

  // Films list
  {
    path: 'films',
    loadComponent: () =>
      import('./features/films/pages/films-list.component').then(m => m.FilmsListComponent),
    resolve: { films: FilmsResolver }
  },

  // Default redirect
  { path: '', redirectTo: 'films', pathMatch: 'full' }
];