import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as FilmsActions from './films.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { FilmsDataService } from '../services/films-data.service';
import { normalizeFilm } from '../../../shared/utils/entities-normalizer';
import { Film } from '../../../store/models/films.models';

@Injectable()
export class FilmsEffects {

  loadFilms$: Observable<
    ReturnType<typeof FilmsActions.loadFilmsSuccess> |
    ReturnType<typeof FilmsActions.loadFilmsFailure>
  >;

  constructor(
    private actions$: Actions,
    private filmsService: FilmsDataService
  ) {
    this.loadFilms$ = createEffect(() =>
      this.actions$.pipe(
        ofType(FilmsActions.loadFilms),
        mergeMap(() =>
          this.filmsService.getAll().pipe(
            map(films => FilmsActions.loadFilmsSuccess({
                films: films.map((f: Film) => normalizeFilm(f))
              })),
            catchError(error => of(FilmsActions.loadFilmsFailure({ error })))
          )
        )
      )
    );
  }
}