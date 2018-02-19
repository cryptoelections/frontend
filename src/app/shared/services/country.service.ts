import {Injectable} from '@angular/core';
import {BASE_URL, BaseService} from './base.service';
import {Country} from '../models/country.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CountryService extends BaseService<Country> {
  public getList(): Observable<any> {
    const url = `${BASE_URL}/json/countries-static.json`;
    return this.http.get(url)
      .map(response => JSON.parse(JSON.stringify(response)));
  }

  public getDynamic(): Observable<{ [id: string]: Partial<Country> }> {
    const url = `${BASE_URL}/json/countries-dynamic.json`;
    return this.http.get(url)
      .map(response => JSON.parse(JSON.stringify(response)));
  }
}
