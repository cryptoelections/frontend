import {Injectable} from '@angular/core';
import {BaseService, JSON_URL} from './base.service';
import {City} from '../models/city.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CityService extends BaseService<City> {
  public getList(): Observable<Array<City>> {
    const url = `${JSON_URL}cities-static.json`;
    return this.http.get(url)
      .map(response => JSON.parse(JSON.stringify(response)));
  }

  public getDynamic(): Observable<{ [id: string]: Partial<City> }> {
    const url = `${JSON_URL}cities-dynamic.json`;
    return this.http.get(url)
      .map(response => JSON.parse(JSON.stringify(response)));
  }
}
