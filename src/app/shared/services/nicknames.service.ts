import {Injectable} from '@angular/core';
import {BaseService, JSON_URL} from './base.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class NicknamesService extends BaseService<any> {
  public getDynamic(): Observable<{ [address: string]: string }> {
    const url = `${JSON_URL}nicknames-dynamic.json`;
    return this.http.get(url)
      .map(response => response ? JSON.parse(JSON.stringify(response)) : {});
  }
}
