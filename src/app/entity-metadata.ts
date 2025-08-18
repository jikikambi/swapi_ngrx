// src/app/entity-metadata.ts
import { EntityMetadataMap, EntityDataModuleConfig } from '@ngrx/data';
import { CharacterDataService } from './features/characters/services/characters-data.service';
import { PlanetDataService } from './features/planets/services/planet-data.service';
import { SpeciesDataService } from './features/species/services/Species-data.service';
import { VehicleDataService } from './features/vehicles/services/vehicles-data.service';
import { StarshipDataService } from './features/starships/services/starship-data.service';
import { FilmsDataService } from './features/films/services/films-data.service';
import { CustomDataServiceConfig } from './shared/utils/provide-custom-data-services';
import { extractSwapiId } from './shared/utils/swapi.utils';

const entityMetadata: EntityMetadataMap = {
  Film: {
    //selectId: (film) => film.url,   // <-- use SWAPI `url` as the entity ID
    selectId: (film) => extractSwapiId(film.url), // "1", "2", etc.
  },
  Character: {
    selectId: (c) => extractSwapiId(c.url),
  },
  Planet: {
    selectId: (p) => extractSwapiId(p.url),
  },
  Species: {
    selectId: (s) => extractSwapiId(s.url),
  },
  Starship: {
    selectId: (s) => extractSwapiId(s.url),
  },
  Vehicle: {
    selectId: (v) => extractSwapiId(v.url),
  }
};

const pluralNames = {
  Film: 'Films',
  Character: 'Characters',
  Planet: 'Planets',
  Species: 'Species',
  Starship: 'Starships',
  Vehicle: 'Vehicles'
};

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames
};

// Custom Data Services for entities where we override default behavior
export const customDataServices : CustomDataServiceConfig[] = [
  { entityName: 'Film', dataService: FilmsDataService },
  { entityName: 'Character', dataService: CharacterDataService },
  { entityName: 'Planet', dataService: PlanetDataService },
  { entityName: 'Species', dataService: SpeciesDataService },
  { entityName: 'Starship', dataService: StarshipDataService },
  { entityName: 'Vehicle', dataService: VehicleDataService },
];
