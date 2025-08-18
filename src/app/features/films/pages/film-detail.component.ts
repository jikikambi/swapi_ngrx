import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntityCollectionServiceFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Character } from '../../../store/models/characters.models';
import { selectFilmById } from '../store/films.selectors';
import { Planet } from '../../../store/models/planets.models';
import { Species } from '../../../store/models/species.models';
import { Starship } from '../../../store/models/starships.model';
import { Vehicle } from '../../../store/models/vehicles.models';
import { extractSwapiId } from '../../../shared/utils/swapi.utils';
import { Film } from '../../../store/models/films.models';
import { CommonModule, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-film-details',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.scss']
})
export class FilmDetailComponent implements OnInit {
  film$!: Observable<Film | null>;
  characters$!: Observable<Character[]>;
  planets$!: Observable<Planet[]>;
  species$!: Observable<Species[]>;
  starships$!: Observable<Starship[]>;
  vehicles$!: Observable<Vehicle[]>;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private serviceFactory: EntityCollectionServiceFactory
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.film$ = this.store.select(selectFilmById(id));

    this.characters$ = this.getEntitiesFromUrls<Character>('Character', 'characters');
    this.planets$ = this.getEntitiesFromUrls<Planet>('Planet', 'planets');
    this.species$ = this.getEntitiesFromUrls<Species>('Species', 'species');
    this.starships$ = this.getEntitiesFromUrls<Starship>('Starship', 'starships');
    this.vehicles$ = this.getEntitiesFromUrls<Vehicle>('Vehicle', 'vehicles');
  }

  private getEntitiesFromUrls<T>(entityName: string, filmProp: keyof Film): Observable<T[]> {
    const service = this.serviceFactory.create<T>(entityName);
    return this.film$.pipe(
      switchMap(film => {
        if (!film || !Array.isArray(film[filmProp])) return of([]);
        const ids = (film[filmProp] as string[]).map(extractSwapiId);
        return service.getAll().pipe(
          switchMap(() => {
            const allEntities = service.entities$ as Observable<T[]>;
            return allEntities.pipe(
              switchMap(list => of(list.filter((e: any) => ids.includes(extractSwapiId(e.url)))))
            );
          })
        );
      })
    );
  }
}
