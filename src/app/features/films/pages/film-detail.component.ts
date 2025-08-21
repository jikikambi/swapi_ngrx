import { Component, effect, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EntityCollectionServiceFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Film } from '../../../store/models/films.models';
import { Character } from '../../../store/models/characters.models';
import { Planet } from '../../../store/models/planets.models';
import { Species } from '../../../store/models/species.models';
import { Starship } from '../../../store/models/starships.model';
import { Vehicle } from '../../../store/models/vehicles.models';
import { selectFilmById } from '../store/films.selectors';
import { CommonModule } from '@angular/common';
import { extractSwapiId } from '../../../shared/utils/swapi.utils';

interface Section<T> {
  title: string;
  data: WritableSignal<T[]>;
  type: string;
  clickable: boolean;
}

@Component({
  selector: 'app-film-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.scss']
})
export class FilmDetailComponent {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private serviceFactory = inject(EntityCollectionServiceFactory);
  private router = inject(Router);

  /** Film signal (from store selector) */
  film = toSignal(
    this.store.select(selectFilmById(this.route.snapshot.paramMap.get('id')!)),
    { initialValue: null }
  );

  /** Sections config (plain array, but each has a reactive data signal) */
  sections: Section<any>[] = [
    { title: 'Characters', data: this.createEntitiesSignal<Character>('Character', 'characters'), type: 'character', clickable: true },
    { title: 'Planets',    data: this.createEntitiesSignal<Planet>('Planet', 'planets'),         type: 'planet',   clickable: false },
    { title: 'Species',   data: this.createEntitiesSignal<Species>('Species', 'species'),       type: 'species',  clickable: false },
    { title: 'Starships', data: this.createEntitiesSignal<Starship>('Starship', 'starships'),   type: 'starship', clickable: true },
    { title: 'Vehicles',  data: this.createEntitiesSignal<Vehicle>('Vehicle', 'vehicles'),      type: 'vehicle',  clickable: false },
  ];

  /** Navigate to related detail */
  goToDetail(entityType: string, entity: { url: string }) {
    const filmId = this.route.snapshot.paramMap.get('id');
    const entityId = extractSwapiId(entity.url);
    this.router.navigate(['/films', filmId, entityType.toLowerCase() + 's', entityId]);
  }

  /** Create a reactive signal for related entities */
  private createEntitiesSignal<T>(entityName: string, filmProp: keyof Film): WritableSignal<T[]> {
    const service = this.serviceFactory.create<T>(entityName);
    const data = signal<T[]>([]);

    // Subscribe once to entities$ (no reactive loop)
    const entitiesSig = toSignal(service.entities$, { initialValue: [] });

    // Update whenever film or entities change
    effect(() => {
      const filmValue = this.film();
      const entities = entitiesSig();

      if (!filmValue || !Array.isArray(filmValue[filmProp])) {
        data.set([]);
        return;
      }

      const ids = (filmValue[filmProp] as string[]).map(extractSwapiId);
      const filtered = entities.filter(e => ids.includes(extractSwapiId((e as any).url)));
      data.set(filtered);
    });

    // Ensure service loads entities
    service.getAll();

    return data;
  }
}