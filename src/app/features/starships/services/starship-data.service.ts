import { Injectable } from '@angular/core';
import { HttpUrlGenerator } from '@ngrx/data';
import { HttpClient } from '@angular/common/http';
import { Starship } from '../../../store/models/starships.model';
import { BaseDataService } from '../../../shared/services/base-data.service';
import { Observable, map } from 'rxjs';
import { normalizeStarship } from '../../../shared/utils/entities-normalizer';

@Injectable()
export class StarshipDataService extends BaseDataService<Starship> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Starship', 'starships', http, httpUrlGenerator);
  }

  override getAll(): Observable<Starship[]> {
    return super.getAll().pipe(map(chars => chars.map(normalizeStarship)));
  }

  override getById(id: string): Observable<Starship> {
    return super.getById(id).pipe(map(normalizeStarship));
  }
}