import { Injectable } from '@angular/core';

export enum StorageKeys {
  Account = 'account',
  CountryFilter = 'countries',
  CityFilter = 'cities'
}

@Injectable()
export class StorageService {
  public get(key: string) {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {};
  }

  public update(key: string, value: object) {
    const prevValue = this.get(key);
    const newValue = JSON.stringify({ ...prevValue, ...value });
    localStorage.setItem(key, newValue);
  }

  public remove(key: string) {
    localStorage.removeItem(key);
  }
}
