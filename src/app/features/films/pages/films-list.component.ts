import { CommonModule, AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { EntityCollectionServiceFactory } from "@ngrx/data";
import { Observable } from "rxjs";
import { extractSwapiId } from "../../../shared/utils/swapi.utils";
import { Film } from "../../../store/models/films.models";
import { FilmsDataService } from "../services/films-data.service";

@Component({
  selector: 'app-films-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  templateUrl: './films-list.component.html',
  styleUrls: ['./films-list.component.scss'],
})
export class FilmsListComponent {
  private readonly serviceFactory = inject(EntityCollectionServiceFactory);
  private readonly filmService = this.serviceFactory.create<Film>('Film');

  private readonly filmsDataService = inject(FilmsDataService);

  readonly extractSwapiId = extractSwapiId;

  films$: Observable<Film[]> = this.filmService.entities$;
  loading$: Observable<boolean> = this.filmService.loading$;

  nextPageUrl: string | null = null;
  prevPageUrl: string | null = null;

  constructor() {
    this.loadPage(); // initial page load
  }

  loadPage(url?: string) {
    this.filmsDataService.getPage(url).subscribe(page => {
      this.filmService.addAllToCache(page.results); // sync into NgRx Data cache
      this.nextPageUrl = page.next;
      this.prevPageUrl = page.previous;
    });
  }
}