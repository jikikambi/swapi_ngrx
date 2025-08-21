import { Injectable } from '@angular/core';
import { HttpUrlGenerator } from '@ngrx/data';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../../../store/models/vehicles.models';
import { BaseDataService } from '../../../shared/services/base-data.service';
import { Observable, map } from 'rxjs';
import { normalizeVehicle } from '../../../shared/utils/entities-normalizer';

@Injectable()
export class VehicleDataService extends BaseDataService<Vehicle> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Vehicle', 'vehicles', http, httpUrlGenerator);
  }

  override getAll(): Observable<Vehicle[]> {
    return super.getAll().pipe(map(vehicles => vehicles.map(normalizeVehicle)));
  }

  override getById(id: string): Observable<Vehicle> {
    return super.getById(id).pipe(map(normalizeVehicle));
  }
}