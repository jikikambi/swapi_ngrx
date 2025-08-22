import { Component, inject, signal, WritableSignal, computed, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EntityCollectionServiceFactory } from '@ngrx/data';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

import { Character } from '../../../store/models/characters.models';
import { Film } from '../../../store/models/films.models';
import { Planet } from '../../../store/models/planets.models';
import { Species } from '../../../store/models/species.models';
import { Starship } from '../../../store/models/starships.model';
import { Vehicle } from '../../../store/models/vehicles.models';

import { extractSwapiId } from '../../../shared/utils/swapi.utils';
import { Section } from '../../../shared/utils/Section';
import { createEntitySection } from '../../../shared/utils/entity-signals.utils';
import { expandCollapse } from '../../../shared/animations/expand-collapse.animation';

@Component({
  selector: 'app-character-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss'],
  animations: [expandCollapse],
})
export class CharacterDetailComponent {

  private route = inject(ActivatedRoute);
  private serviceFactory = inject(EntityCollectionServiceFactory);
  private router = inject(Router);

  private characterService = this.serviceFactory.create<Character>('Character');
  private charactersSig = toSignal(this.characterService.entities$, { initialValue: [] });

  character: WritableSignal<Character | null> = signal(null);

  constructor() {
    const charId = this.route.snapshot.paramMap.get('id')!;
    this.characterService.getByKey(charId);

    // Keep signal updated
    effect(() => {
      const all = this.charactersSig();
      this.character.set(all.find(c => extractSwapiId(c.url) === charId) ?? null);
    });
  }

  sections: Section<any>[] = [
    createEntitySection<Character, Film, 'films'>(this.serviceFactory, 'Film', () => this.character(), 'films', 'film', true),
    createEntitySection<Character, Starship, 'starships'>(this.serviceFactory, 'Starship', () => this.character(), 'starships', 'starship'),
    createEntitySection<Character, Vehicle, 'vehicles'>(this.serviceFactory, 'Vehicle', () => this.character(), 'vehicles', 'vehicle'),
    createEntitySection<Character, Species, 'species'>(this.serviceFactory, 'Species', () => this.character(), 'species', 'species'),
    createEntitySection<Character, Planet, 'homeworld'>(this.serviceFactory, 'Planet', () => this.character(), 'homeworld', 'planet')
  ];

  toggleSection(section: Section<any>) {
    section.expanded = !section.expanded;
  }

  expandAll() {
    this.sections.forEach(s => s.expanded = true);
  }

  collapseAll() {
    this.sections.forEach(s => s.expanded = false);
  }

  goToDetail(entityType: string, entity: { url: string }) {
    const charId = this.route.snapshot.paramMap.get('id');
    const entityId = extractSwapiId(entity.url);
    this.router.navigate(
      ['/characters', charId, entityType.toLowerCase() + 's', entityId],
      { state: { from: `/characters/${charId}` } }
    );
  }
}