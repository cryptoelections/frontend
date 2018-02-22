import {Injectable} from '@angular/core';
import {BaseService, JSON_URL} from './base.service';
import {Country} from '../models/country.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CountryService extends BaseService<Country> {
  public getList(): Observable<any> {
    const url = `${JSON_URL}countries-static.json`;
    return this.http.get(url)
      .map(response => response ? JSON.parse(JSON.stringify(response)) : []);
  }

  public getDynamic(): Observable<{ [id: string]: Partial<Country> }> {
    const url = `${JSON_URL}countries-dynamic.json`;
    return this.http.get(url)
      .map(response => response ? JSON.parse(JSON.stringify(response)) : {});
  }
}
