import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import * as fromFilms from '../features/films/store/films.reducer';

export const appReducer: ActionReducerMap<AppState> = {
  [fromFilms.filmsFeatureKey]: fromFilms.reducer
};