import * as fromFilms from '../features/films/store/films.reducer';

export interface AppState {
  [fromFilms.filmsFeatureKey]: fromFilms.State;
}