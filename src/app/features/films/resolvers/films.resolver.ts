// src/app/features/films/store/films.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';
import { selectAllFilms } from '../store/films.selectors';
import { loadFilms } from '../store/films.actions';


export const FilmsResolver: ResolveFn<boolean> = () => {
  const store = inject(Store);

  return store.select(selectAllFilms).pipe(
    first(),
    switchMap(films => {
      if (!films || films.length === 0) {
        // Dispatch only if store is empty
        store.dispatch(loadFilms());
        return store.select(selectAllFilms).pipe(
          filter(f => f.length > 0),
          first(),
          switchMap(() => of(true))
        );
      }
      return of(true);
    })
  );
};



// @Injectable({ providedIn: 'root' })
// export class FilmsResolver implements Resolve<boolean> {

//   constructor(private store: Store) {}

//   resolve(): Observable<boolean> {
//     return this.store.select(selectAllFilms).pipe(
//       first(),
//       switchMap(loaded => {
//         if (loaded) return of(true);

//         return this.store.select(selectAllFilms).pipe(
//           first(),
//           tap(films => {
//             if (!films.length) {
//               this.store.dispatch(loadFilms());
//             }
//           }),
//           switchMap(() =>
//             this.store.select(selectAllFilms).pipe(
//               first(),
//               tap(films => {
//                 if (films.length) {
//                   const normalized = films.map(normalizeFilm);
//                   console.log('✅ Normalized films', normalized);
//                 }
//               }),
//               switchMap(() => of(true)),
//               catchError(() => of(false))
//             )
//           )
//         );
//       })
//     );
//   }
// }


// // @Injectable({ providedIn: 'root' })
// // export class FilmsResolver implements Resolve<Film[]> {
// //   constructor(private store: Store) {}

// //   resolve(): Observable<Film[]> {
// //     return this.store.select(selectAllFilms).pipe(
// //       tap(films => {
// //         if (!films || films.length === 0) {
// //           this.store.dispatch(loadFilms());
// //         }
// //       }),
// //       filter(films => films.length > 0),
// //       first()
// //     );
// //   }
// // }

// @Injectable({ providedIn: 'root' })
// export class FilmsResolver implements Resolve<boolean> {
//   constructor(private store: Store) {}

//   resolve(): Observable<boolean> {
//     return this.store.select(selectAllFilms).pipe(
//       tap(films => {
//         if (!films || films.length === 0) {
//           console.log('FilmsResolver: loading films...');
//           this.store.dispatch(loadFilms());
//         }
//       }),
//       first(), // resolves immediately after first emission (empty or not)
//       map(() => true)
//     );
//   }
// }
