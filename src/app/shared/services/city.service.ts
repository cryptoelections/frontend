import {Injectable} from '@angular/core';
import {BaseService, JSON_URL} from './base.service';
import {City} from '../models/city.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CityService extends BaseService<City> {
  public getList(): Observable<Array<City>> {
    const url = `${JSON_URL}cities-static.json`;
    return this.http.get(url)
      .map(response => response ? JSON.parse(JSON.stringify(response)) : []);
  }

  public getDynamic() {
    const url = `${JSON_URL}cities-dynamic.json`;
    return new Promise((resolve, reject) => {
      this.http.get(url)
        .toPromise()
        .then(res => {
          resolve(res ? JSON.parse(JSON.stringify(res)) : {});
        });
    });
  }

  public calculateCityPrice(purchases: number, startPrice: number, multiplierStep: number): number {
    let price = startPrice;

    for (let i = 1; i <= purchases; i++) {
      if (i <= multiplierStep) {
        price = price * 2;
      } else {
        price = (price * 12) / 10;
      }
    }
    return price;
  }
}
