import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StorageKeys } from './storage.service';

const Web3 = require('web3');
const contract = require('truffle-contract');
declare var window: any;

export const GAS = 3000000;

@Injectable()
export class AuthService {
  public web3;
  public accounts;
  public account;

  public CryptoCity = contract(); // todo: add contract

  public getAccount(): Observable<any> {
    this.web3 = new Web3(window.web3.currentProvider);

    return this.web3.eth.getAccounts((err, accs) => {
      this.accounts = accs;
      this.account = this.accounts[0];
      localStorage.setItem(StorageKeys.Account, JSON.stringify(this.account));
      return Observable.of(this.account);
    });
  }

  public buyCity(cityId, price) {
    console.log('buying', cityId, 'for', price)
    // let CryptoCityInstance;
    // this.CryptoCity.deployed()
    //   .then((instance) => {
    //     CryptoCityInstance = instance;
    // return CryptoCityInstance.buyCity(
    //   cityId,
    //   {
    //     from: this.account, gas: GAS,
    //     value: Web3.toWei(price, 'ether')
    //   })
    // }).catch(err => console.log(err));
  }

  public getCityOwner(cityId) {
    let CryptoCityInstance;
    this.CryptoCity.deployed()
      .then((instance) => {
        CryptoCityInstance = instance;

        return CryptoCityInstance.getCityOwner(cityId);
      })
      .then((owner) => console.log(`${cityId}'s major - ${owner}`));
  }
}
