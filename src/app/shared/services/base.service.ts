import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';

export const BASE_URL = 'https://cryptoelections.ams3.digitaloceanspaces.com';
export const JSON_URL = environment.pathToJsons;
export const DEFAULT_PRICE = 20000000000000000;

@Injectable()
export class BaseService<T> {
  constructor(protected http: HttpClient) {
  }

  public getList(): Observable<Array<T>> {
    const url = '...';
    const options = {headers: {}};
    return this.http.get(url, options)
    // .map((json: any) => JSON.parse(json))
      .map(response => response as T[]);
  }
}
