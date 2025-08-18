import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResponse } from './PaginatedResponse';

export class BaseDataService<T> extends DefaultDataService<T> {
  protected baseUrl: string;

  constructor(
    entityName: string,
    endpoint: string,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator
  ) {
    super(entityName, http, httpUrlGenerator);
    this.baseUrl = `${environment.apiBaseUrl}/${endpoint}`;
  }

  /**
   * Override to unwrap SWAPI’s `{ results: [] }` format
   */
  override getAll(): Observable<T[]> {
    return this.http.get<PaginatedResponse<T>>(this.baseUrl).pipe(
      map(res => res.results)
    );
  }

  override getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}/`);
  }

  /**
   * Fetch multiple entities by IDs in parallel
   */
  getMany(ids: string[]): Observable<T[]> {
    if (!ids.length) return of([]);
    return forkJoin(ids.map(id => this.getById(id)));
  }

  /**
   * Fetch a specific SWAPI page
   */
  getPage(url?: string): Observable<PaginatedResponse<T>> {
    const targetUrl = url ?? this.baseUrl;
    return this.http.get<PaginatedResponse<T>>(targetUrl);
  }
}