import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilmsResolver } from './resolvers/films.resolver';
import { FilmsListComponent } from './pages/films-list.component';

const routes: Routes = [
  {
    path: '',
    component: FilmsListComponent,
    resolve: { films: FilmsResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmsRoutingModule {}
