import { Injectable } from '@angular/core';
import { HttpUrlGenerator } from '@ngrx/data';
import { HttpClient } from '@angular/common/http';
import { Character } from '../../../store/models/characters.models';
import { BaseDataService } from '../../../shared/services/base-data.service';
import { Observable, map } from 'rxjs';
import { normalizeCharacter } from '../../../shared/utils/entities-normalizer';

@Injectable()
export class CharacterDataService extends BaseDataService<Character> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Character', 'people', http, httpUrlGenerator);
  }

  override getAll(): Observable<Character[]> {
    return super.getAll().pipe(
      map(characters => characters.map(normalizeCharacter))
    );
  }

  override getById(id: string): Observable<Character> {
    return super.getById(id).pipe(
      map(normalizeCharacter)
    );
  }
}