import { Component, inject, signal, WritableSignal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EntityCollectionServiceFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Film } from '../../../store/models/films.models';
import { Character } from '../../../store/models/characters.models';
import { Planet } from '../../../store/models/planets.models';
import { Species } from '../../../store/models/species.models';
import { Starship } from '../../../store/models/starships.model';
import { Vehicle } from '../../../store/models/vehicles.models';
import { selectFilmById } from '../store/films.selectors';
import { expandCollapse } from '../../../shared/animations/expand-collapse.animation';
import { createEntitySection } from '../../../shared/utils/entity-signals.utils';
import { Section } from '../../../shared/utils/Section';
import { extractSwapiId } from '../../../shared/utils/swapi.utils';

@Component({
  selector: 'app-film-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.scss'],
  animations: [expandCollapse]
})
export class FilmDetailComponent {

  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private serviceFactory = inject(EntityCollectionServiceFactory);
  private router = inject(Router);

  /** Signal for the current film */
  film = toSignal(
    this.store.select(selectFilmById(this.route.snapshot.paramMap.get('id')!)),
    { initialValue: null }
  );

  /** Collapsible sections for related entities */
  sections: Section<any>[] = [
    createEntitySection<Film, Character, 'characters'>(this.serviceFactory, 'Character', () => this.film(), 'characters', 'character', true),
    createEntitySection<Film, Planet, 'planets'>(this.serviceFactory, 'Planet', () => this.film(), 'planets', 'planet'),
    createEntitySection<Film, Species, 'species'>(this.serviceFactory, 'Species', () => this.film(), 'species', 'species'),
    createEntitySection<Film, Starship, 'starships'>(this.serviceFactory, 'Starship', () => this.film(), 'starships', 'starship'),
    createEntitySection<Film, Vehicle, 'vehicles'>(this.serviceFactory, 'Vehicle', () => this.film(), 'vehicles', 'vehicle')
  ];

  /** Toggle a single section open/closed */
  toggleSection(section: Section<any>) {
    section.expanded = !section.expanded;
  }

  /** Expand all sections */
  expandAll() {
    this.sections.forEach(s => s.expanded = true);
  }

  /** Collapse all sections */
  collapseAll() {
    this.sections.forEach(s => s.expanded = false);
  }

  /** Navigate to entity detail */
  goToDetail(entityType: string, entity: { url: string }) {
    const filmId = this.route.snapshot.paramMap.get('id');
    const entityId = extractSwapiId(entity.url);
    this.router.navigate(
      ['/films', filmId, entityType.toLowerCase() + 's', entityId],
      { state: { from: `/films/${filmId}` } }
    );
  }
}