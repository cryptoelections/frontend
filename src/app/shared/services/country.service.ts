import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Country } from '../models/country.model';
import { Observable } from 'rxjs/Observable';
import {City} from '../models/city.model';

@Injectable()
export class CountryService extends BaseService<Country> {
  public getList(): Observable<any> {
    const url = 'data/countries-static.json';
    return this.http.get(url)
      .map(response => JSON.parse(JSON.stringify(response)));
  }

  public getDynamic(): Observable<Array<Partial<Country>>> {
    const url = 'data/countries-dynamic.json';
    return this.http.get(url)
      .map(response => JSON.parse(JSON.stringify(response)));
  }
}
