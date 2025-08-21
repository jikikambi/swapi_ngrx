import { Injectable } from '@angular/core';
import { HttpUrlGenerator } from '@ngrx/data';
import { HttpClient } from '@angular/common/http';
import { Planet } from '../../../store/models/planets.models';
import { BaseDataService } from '../../../shared/services/base-data.service';
import { Observable, map } from 'rxjs';
import { normalizePlanet } from '../../../shared/utils/entities-normalizer';

@Injectable()
export class PlanetDataService extends BaseDataService<Planet> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Planet', 'planets', http, httpUrlGenerator);
  }

  override getAll(): Observable<Planet[]> {
    return super.getAll().pipe(map(planets => planets.map(normalizePlanet)));
  }

  override getById(id: string): Observable<Planet> {
    return super.getById(id).pipe(map(normalizePlanet));
  }
}