import { Injectable } from '@angular/core';

export enum StorageKeys {
  Account = 'account'
}

@Injectable()
export class StorageService {
  get(key: string) {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {};
  }

  update(key: string, value: object) {
    const prevValue = this.get(key);
    const newValue = JSON.stringify({ ...prevValue, ...value });
    localStorage.setItem(key, newValue);
  }
}
