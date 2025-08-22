import { WritableSignal, signal, Signal, effect, computed } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { EntityCollectionServiceFactory } from "@ngrx/data";
import { Section } from "./Section";
import { extractSwapiId } from "./swapi.utils";

/**
 * Creates a Section<T> for a parent entity P.
 * Handles both array URLs and single URL properties.
 */
export function createEntitySection<
  P,                   // Parent entity type
  T extends { url: string },  // Child entity type
  K extends keyof P             // Key in parent pointing to array or single URL
>(
  serviceFactory: EntityCollectionServiceFactory,
  entityName: string,
  parentSignal: () => P | null,
  parentProp: K,
  type: string,
  expanded = false
): Section<T> {

  const service = serviceFactory.create<T>(entityName);
  const data: WritableSignal<T[]> = signal<T[]>([]);
  const entitiesSig: Signal<T[]> = toSignal(service.entities$, { initialValue: [] });

  effect(() => {
    const parent = parentSignal();
    if (!parent) return;

    const entities = entitiesSig();
    const propValue = parent[parentProp];

    if (!propValue) {
      data.set([]);
      return;
    }

    // Normalize to string[] safely
    const urls: string[] = Array.isArray(propValue)
      ? (propValue as unknown as string[])
      : [propValue as unknown as string];

    const ids = urls.map(extractSwapiId);
    const filtered = entities.filter(e => ids.includes(extractSwapiId(e.url)));
    data.set(filtered);
  });

  service.getAll();

  return {
    title: entityName,
    type,
    data,
    expanded,
    hasData: computed(() => data().length > 0)
  };
}