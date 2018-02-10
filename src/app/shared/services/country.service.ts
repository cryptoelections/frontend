import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Country } from '../models/country.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CountryService extends BaseService<Country> {
  public getList(): Observable<any> {
    const url = 'data/countries.json';
    return this.http.get(url)
      .map(response => JSON.parse(JSON.stringify(response)));
  }
}
