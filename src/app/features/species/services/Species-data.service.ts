import { Injectable } from '@angular/core';
import { HttpUrlGenerator } from '@ngrx/data';
import { HttpClient } from '@angular/common/http';
import { Species } from '../../../store/models/species.models';
import { BaseDataService } from '../../../shared/services/base-data.service';
import { Observable, map } from 'rxjs';
import { normalizeSpecies } from '../../../shared/utils/entities-normalizer';

@Injectable()
export class SpeciesDataService extends BaseDataService<Species> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Species', 'species', http, httpUrlGenerator);
  }

  override getAll(): Observable<Species[]> {
    return super.getAll().pipe(map(chars => chars.map(normalizeSpecies)));
  }

  override getById(id: string): Observable<Species> {
    return super.getById(id).pipe(map(normalizeSpecies));
  }
}