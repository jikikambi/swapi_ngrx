import { Injectable } from '@angular/core';
import { DefaultHttpUrlGenerator, HttpResourceUrls, Pluralizer } from '@ngrx/data';
import { environment } from '../../environments/environment';

@Injectable()
export class SwapiHttpUrlGenerator extends DefaultHttpUrlGenerator {
  constructor(pluralizer: Pluralizer) {
    super(pluralizer);
  }

  protected override getResourceUrls(entityName: string, root: string): HttpResourceUrls {
    const mapping: Record<string, string> = {
      Film: 'films',
      Character: 'people',
      Planet: 'planets',
      Species: 'species',
      Starship: 'starships',
      Vehicle: 'vehicles'
    };

    const collectionName = mapping[entityName] || entityName.toLowerCase();
    const url = `${environment.apiBaseUrl}/${collectionName}/`;

    return {
      entityResourceUrl: url,
      collectionResourceUrl: url
    };
  }
}
