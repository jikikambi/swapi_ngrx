import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromFilms from './films.reducer';
import { extractSwapiId } from '../../../shared/utils/swapi.utils';

// ---- Feature state
export const selectFilmsState = createFeatureSelector<fromFilms.State>(
  fromFilms.filmsFeatureKey
);

// ---- Basic selectors
export const selectAllFilms = createSelector(
  selectFilmsState,
  fromFilms.selectAll
);

export const selectFilmsLoading = createSelector(
  selectFilmsState,
  state => state.loading
);

export const selectFilmEntities = createSelector(
  selectFilmsState,
  fromFilms.selectEntities
);

// ---- Helper: find by episode_id (our Entity ID)
export const selectFilmByEpisodeId = (episodeId: number) =>
  createSelector(selectFilmEntities, entities => entities[episodeId] ?? null);

// ---- Helper: find by SWAPI resource id (from film.url => /films/:id/)
export const selectFilmByResourceId = (id: string) =>
  createSelector(selectAllFilms, films => {
    return (
      films.find(f => extractSwapiId(f.url) === id) ?? null
    );
  });

// ---- Flexible: try episode_id first, then SWAPI resource id
// export const selectFilmById = (props: { id: string }) =>
export const selectFilmById = (id: string ) =>
  createSelector(selectFilmEntities, selectAllFilms, (entities, films) => {
    // const asNum = Number(props.id);
    const asNum = Number(id);
    if (!Number.isNaN(asNum) && entities[asNum]) {
      // If route param equals episode_id (e.g., "4"), return directly
      return entities[asNum]!;
    }
    // Otherwise match by resource id parsed from film.url (/films/:id/)
    return films.find(f => extractSwapiId(f.url) === id) ?? null;
  });
