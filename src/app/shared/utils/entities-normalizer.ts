import { Character } from "../../store/models/characters.models";
import { Film } from "../../store/models/films.models";
import { Planet } from "../../store/models/planets.models";
import { Species } from "../../store/models/species.models";
import { Starship } from "../../store/models/starships.model";
import { Vehicle } from "../../store/models/vehicles.models";
import { extractSwapiId } from "./swapi.utils";

// Film Normalizer
export function normalizeFilm(film: Film): Film {
  return {
    ...film,
    url: extractSwapiId(film.url),
    // characters: film.characters?.map(extractSwapiId) || [],
    // planets: film.planets?.map(extractSwapiId) || [],
    // species: film.species?.map(extractSwapiId) || [],
    // starships: film.starships?.map(extractSwapiId) || [],
    // vehicles: film.vehicles?.map(extractSwapiId) || []
    characters: film.characters?.map(extractSwapiId) ?? [],
    planets: film.planets?.map(extractSwapiId) ?? [],
    starships: film.starships?.map(extractSwapiId) ?? [],
    vehicles: film.vehicles?.map(extractSwapiId) ?? [],
    species: film.species?.map(extractSwapiId) ?? [],
  };
}

// Character Normalizer
export function normalizeCharacter(raw: Character): Character {
  return {
    ...raw,
    url: extractSwapiId(raw.url),
    films: raw.films?.map(extractSwapiId) ?? [],
    species: raw.species?.map(extractSwapiId) ?? [],
    vehicles: raw.vehicles?.map(extractSwapiId) ?? [],
    starships: raw.starships?.map(extractSwapiId) ?? [],
  };
}

// Planet Normalizer
export function normalizePlanet(raw: Planet): Planet {
  return {
    ...raw,
    url: extractSwapiId(raw.url),
    residents: raw.residents?.map(extractSwapiId) ?? [],
    films: raw.films?.map(extractSwapiId) ?? [],
  };
}

// Species Normalizer
export function normalizeSpecies(raw: Species): Species {
  return {
    ...raw,
    url: extractSwapiId(raw.url),
    people: raw.people?.map(extractSwapiId) ?? [],
    films: raw.films?.map(extractSwapiId) ?? [],
  };
}

// Vehicle Normalizer
export function normalizeVehicle(raw: Vehicle): Vehicle {
  return {
    ...raw,
    url: extractSwapiId(raw.url),
    pilots: raw.pilots?.map(extractSwapiId) ?? [],
    films: raw.films?.map(extractSwapiId) ?? [],
  };
}

// Starship Normalizer
export function normalizeStarship(raw: Starship): Starship {
  return {
    ...raw,
    url: extractSwapiId(raw.url),
    pilots: raw.pilots?.map(extractSwapiId) ?? [],
    films: raw.films?.map(extractSwapiId) ?? [],
  };
}