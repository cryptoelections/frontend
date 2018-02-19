import {Injectable} from '@angular/core';
import {BASE_URL, BaseService} from './base.service';
import {City} from '../models/city.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CityService extends BaseService<City> {
  public getList(): Observable<Array<City>> {
    const url = `${BASE_URL}/json/cities-static.json`;
    return this.http.get(url)
      .map(response => JSON.parse(JSON.stringify(response)));
  }

  public getDynamic(): Observable<{ [id: string]: Partial<City> }> {
    const url = `${BASE_URL}/json/cities-dynamic.json`;
    return this.http.get(url)
      .map(response => JSON.parse(JSON.stringify(response)));
  }
}
