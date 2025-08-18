import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpUrlGenerator } from '@ngrx/data';
import { map } from 'rxjs';
import { BaseDataService } from '../../../shared/services/base-data.service';
import { normalizeFilm } from '../../../shared/utils/entities-normalizer';
import { Film } from '../../../store/models/films.models';

@Injectable()
export class FilmsDataService extends BaseDataService<Film> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Film', 'films', http, httpUrlGenerator);
  }

  override getAll() {
    return super.getAll().pipe(
      map(films => films.map(normalizeFilm))
    );
  }

  override getById(id: string) {
    return super.getById(id).pipe(
      map(normalizeFilm)
    );
  }
}