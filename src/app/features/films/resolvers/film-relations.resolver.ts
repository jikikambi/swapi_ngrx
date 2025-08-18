import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, forkJoin } from 'rxjs';
import { filter, first, switchMap, catchError } from 'rxjs/operators';

import { selectFilmById } from '../store/films.selectors';

import { CharacterDataService } from '../../characters/services/characters-data.service';
import { PlanetDataService } from '../../planets/services/planet-data.service';
import { StarshipDataService } from '../../starships/services/starship-data.service';
import { VehicleDataService } from '../../vehicles/services/vehicles-data.service';
import { SpeciesDataService } from '../../species/services/Species-data.service';

export const FilmRelationsResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  const characterService = inject(CharacterDataService);
  const planetService = inject(PlanetDataService);
  const speciesService = inject(SpeciesDataService);
  const starshipService = inject(StarshipDataService);
  const vehicleService = inject(VehicleDataService);

  const filmId = route.paramMap.get('id')!;

  return store.select(selectFilmById(filmId)).pipe(
    filter(film => !!film),
    first(),
    switchMap(film => {
      if (!film) return of(true);

      // We now assume these arrays are plain IDs, e.g., ['1', '2', '3']
      const { characters = [], planets = [], species = [], starships = [], vehicles = [] } = film;

      return forkJoin([
        characterService.getMany(characters).pipe(catchError(() => of([]))),
        planetService.getMany(planets).pipe(catchError(() => of([]))),
        speciesService.getMany(species).pipe(catchError(() => of([]))),
        starshipService.getMany(starships).pipe(catchError(() => of([]))),
        vehicleService.getMany(vehicles).pipe(catchError(() => of([])))
      ]).pipe(
        first(),
        switchMap(() => of(true))
      );
    })
  );
};
