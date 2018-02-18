import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class NicknamesService extends BaseService<any> {
  public getDynamic(): Observable<{ [address: string]: string }> {
    const url = 'data/nicknames-dynamic.json';
    return this.http.get(url)
      .map(response => JSON.parse(JSON.stringify(response)));
  }
}
