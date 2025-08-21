import { CommonModule } from "@angular/common";
import { Component, inject, WritableSignal, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { EntityCollectionServiceFactory } from "@ngrx/data";
import { Character } from "../../../store/models/characters.models";
import { Starship } from "../../../store/models/starships.model";
import { extractSwapiId } from "../../../shared/utils/swapi.utils";

@Component({
  selector: 'app-character-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss']
})
export class CharacterDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private serviceFactory = inject(EntityCollectionServiceFactory);

  // Writable signals
  character: WritableSignal<Character | null> = signal(null);
  starships: WritableSignal<Starship[]> = signal([]);

  filmId!: string;
  charId!: string;

  constructor() {
    this.filmId = this.route.parent?.snapshot.paramMap.get('id')!;
    this.charId = this.route.snapshot.paramMap.get('characterId')!;

    this.loadCharacter();
  }

  private loadCharacter() {
    const characterService = this.serviceFactory.create<Character>('Character');
    const starshipService = this.serviceFactory.create<Starship>('Starship');

    // Load character
    characterService.getByKey(this.charId).subscribe(char => {
      this.character.set(char);

      if (char?.starships?.length) {
        const ids = char.starships.map(extractSwapiId);

        // Ensure all starships are loaded
        starshipService.getAll().subscribe(() => {
          starshipService.entities$.subscribe(list => {
            const filtered = list.filter(s => ids.includes(extractSwapiId(s.url)));
            this.starships.set(filtered);
          });
        });
      } else {
        this.starships.set([]);
      }
    });
  }

  goToStarship(shipId: string) {
    this.router.navigate(['/films', this.filmId, 'starships', shipId]);
  }

  goBack() {
  const filmId = this.route.parent?.snapshot.paramMap.get('id');
  this.router.navigate(['/films', filmId]);
}


  protected extractId = extractSwapiId;
}
