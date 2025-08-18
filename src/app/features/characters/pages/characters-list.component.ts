import { Component, OnInit } from '@angular/core';
import { EntityCollectionServiceFactory } from '@ngrx/data';
import { Observable } from 'rxjs';
import { Character } from '../../../store/models/characters.models';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [CommonModule,AsyncPipe],
  templateUrl: './characters-list.component.html',
  styleUrls:['./characters-list.component.scss']
})
export class CharactersListComponent implements OnInit {
  characters$!: Observable<Character[]>;

  constructor(private serviceFactory: EntityCollectionServiceFactory) {}

  ngOnInit() {
    const characterService = this.serviceFactory.create<Character>('Character');
    this.characters$ = characterService.entities$;
    characterService.getAll(); // triggers fetch
  }
}
