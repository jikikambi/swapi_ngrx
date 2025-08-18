import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectFilmById } from '../../films/store/films.selectors';
import { extractSwapiId } from '../../../shared/utils/swapi.utils';
import { filter, first, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CharacterDataService } from '../services/characters-data.service';

export const CharactersResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
   const characterDataService = inject(CharacterDataService);

  const filmId = route.paramMap.get('id')!;

  return store.select(selectFilmById(filmId)).pipe(
    filter(film => !!film),
    first(),
    switchMap(film => {
      if (!film?.characters?.length) return of(true);

      const ids = film.characters
        .map((url: string) => extractSwapiId(url))
        .filter((id: string) => !!id);

      return characterDataService.getMany(ids).pipe(
        first(),
        switchMap(() => of(true))
      );
    })
  );
};