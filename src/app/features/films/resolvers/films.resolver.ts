// src/app/features/films/store/films.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';
import { selectAllFilms } from '../store/films.selectors';
import { loadFilms } from '../store/films.actions';

export const FilmsResolver: ResolveFn<boolean> = () => {
  const store = inject(Store);

  return store.select(selectAllFilms).pipe(
    first(),
    switchMap(films => {
      if (!films || films.length === 0) {
        // Dispatch only if store is empty
        store.dispatch(loadFilms());
        return store.select(selectAllFilms).pipe(
          filter(f => f.length > 0),
          first(),
          switchMap(() => of(true))
        );
      }
      return of(true);
    })
  );
};