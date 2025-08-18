import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Film } from '../../../store/models/films.models';
import * as FilmsActions from './films.actions';

export const filmsFeatureKey = 'films';

export interface State extends EntityState<Film> {
  loading: boolean;
  error: any;
}

export const adapter = createEntityAdapter<Film>({
  selectId: film => film.episode_id,
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  error: null,
});

export const reducer = createReducer(
  initialState,
  on(FilmsActions.loadFilms, state => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(FilmsActions.loadFilmsSuccess, (state, { films }) =>
    adapter.setAll(films, { ...state, loading: false })
  ),
  on(FilmsActions.loadFilmsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

export const { selectAll, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors();
