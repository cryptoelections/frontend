import {Injectable} from '@angular/core';
import {BASE_URL, BaseService} from './base.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class NicknamesService extends BaseService<any> {
  public getDynamic(): Observable<{ [address: string]: string }> {
    const url = `${BASE_URL}/json/nicknames-dynamic.json`;
    return this.http.get(url)
      .map(response => JSON.parse(JSON.stringify(response)));
  }
}
