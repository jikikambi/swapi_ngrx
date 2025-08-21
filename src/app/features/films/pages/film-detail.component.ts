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

import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

interface Section<T> {
  title: string;
  data: WritableSignal<T[]>;
  type: string;
  clickable: boolean;
  expanded: boolean;
}

@Component({
  selector: 'app-film-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out')),
    ]),
  ]
  // animations: [
  //   trigger('expandCollapse', [
  //     state('expanded', style({ height: '*', opacity: 1, overflow: 'hidden' })),
  //     state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
  //     transition('expanded <=> collapsed', animate('300ms ease-in-out')),
  //   ]),
  //   trigger('rotateIcon', [
  //     state('expanded', style({ transform: 'rotate(180deg)' })),
  //     state('collapsed', style({ transform: 'rotate(0deg)' })),
  //     transition('expanded <=> collapsed', animate('300ms ease-in-out')),
  //   ])
  // ]
})
export class FilmDetailComponent {

  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private serviceFactory = inject(EntityCollectionServiceFactory);
  private router = inject(Router);

  film = toSignal(
    this.store.select(selectFilmById(this.route.snapshot.paramMap.get('id')!)),
    { initialValue: null }
  );

  sections: Section<any>[] = [
    { title: 'Characters', data: this.createEntitiesSignal<Character>('Character', 'characters'), type: 'character', clickable: true, expanded: true },
    { title: 'Planets', data: this.createEntitiesSignal<Planet>('Planet', 'planets'), type: 'planet', clickable: false, expanded: false },
    { title: 'Species', data: this.createEntitiesSignal<Species>('Species', 'species'), type: 'species', clickable: false, expanded: false },
    { title: 'Starships', data: this.createEntitiesSignal<Starship>('Starship', 'starships'), type: 'starship', clickable: true, expanded: false },
    { title: 'Vehicles', data: this.createEntitiesSignal<Vehicle>('Vehicle', 'vehicles'), type: 'vehicle', clickable: false, expanded: false }
  ];

  /** Toggle single section */
  toggleSection(section: Section<any>) {
    section.expanded = !section.expanded;
  }

  /** Expand all */
  expandAll() {
    this.sections.forEach(s => (s.expanded = true));
  }

  /** Collapse all */
  collapseAll() {
    this.sections.forEach(s => (s.expanded = false));
  }

  /** Navigate to detail */
  goToDetail(entityType: string, entity: { url: string }) {
    const filmId = this.route.snapshot.paramMap.get('id');
    const entityId = extractSwapiId(entity.url);
    this.router.navigate(
      ['/films', filmId, entityType.toLowerCase() + 's', entityId],
      { state: { from: `/films/${filmId}` } }
    );
  }

  private createEntitiesSignal<T>(entityName: string, filmProp: keyof Film): WritableSignal<T[]> {
    const service = this.serviceFactory.create<T>(entityName);
    const data = signal<T[]>([]);
    const entitiesSig = toSignal(service.entities$, { initialValue: [] });

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

    service.getAll();
    return data;
  }
}