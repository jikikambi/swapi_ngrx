import { createAction, props } from '@ngrx/store';
import { Film } from '../../../store/models/films.models';

/** List: /films */
export const loadFilms = createAction('[Films] Load Films');

export const loadFilmsSuccess = createAction(
  '[Films] Load Films Success',
  props<{ films: Film[] }>()
);

export const loadFilmsFailure = createAction(
  '[Films] Load Films Failure',
  props<{ error: unknown }>()
);

/** Optional: Details page /films/:id */
export const loadFilm = createAction(
  '[Films] Load Film',
  props<{ id: number }>()
);

export const loadFilmSuccess = createAction(
  '[Films] Load Film Success',
  props<{ film: Film }>()
);

export const loadFilmFailure = createAction(
  '[Films] Load Film Failure',
  props<{ error: unknown }>()
);
