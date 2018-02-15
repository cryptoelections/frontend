import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StorageKeys } from './storage.service';

const Web3 = require('web3');
const Eth = require('ethjs');

const contract = require('truffle-contract');
const json = require('../../../data/CryptoCity.json');
declare var window: any;

export const GAS = 3000000;

@Injectable()
export class AuthService {
  public web3;
  public accounts;
  public account;
  public accountNickname;
  public coinbase;

  public CryptoCity;

  constructor() {
    this.web3 = new Web3(window.web3.currentProvider);

    this.CryptoCity = contract(json);
    this.CryptoCity.setProvider(window.web3.currentProvider);
  }

  public get isLoggedIn() {
    return !!this.account;
  }

  public getAccount(): Observable<any> {
    this.web3.eth.getCoinbase().then(a => {
      this.coinbase = a;
      this.CryptoCity.defaults({ from: this.coinbase });
    });


    return this.web3.eth.getAccounts((err, accs) => {
      this.accounts = accs;
      this.account = this.accounts[0];
      localStorage.setItem(StorageKeys.Account, JSON.stringify(this.account));
      this.getNickname(this.account).then(nickname => this.accountNickname = nickname);
      return Observable.of(this.account);
    });
  }

  public setNickname(nickname: string) {
    let CryptoCityInstance;
    this.CryptoCity.deployed()
      .then((instance) => {
        CryptoCityInstance = instance;
        console.log(instance);
        return CryptoCityInstance.setNickname(nickname);
      }).catch(err => console.log(err));
  }

  public getNickname(address: string) {
    let CryptoCityInstance;
    return this.CryptoCity.deployed()
      .then((instance) => {
        CryptoCityInstance = instance;
        return CryptoCityInstance.userNicknames(address);
      }).catch(err => console.log(err));
  }

  public buyCity(cityId, price) {
    console.log('buying', cityId, 'for', price);
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

  public getUserCities() {
    let CryptoCityInstance;
    return this.CryptoCity.deployed()
      .then((instance) => {
        CryptoCityInstance = instance;
        console.log(CryptoCityInstance);
        return CryptoCityInstance.userCities(this.coinbase);
      }).catch(err => console.log(err));
  }

  public getCityOwner(cityId) {
    let CryptoCityInstance;
    this.CryptoCity && this.CryptoCity.deployed()
      .then((instance) => {
        CryptoCityInstance = instance;

        return CryptoCityInstance.getCityOwner(cityId);
      })
      .then((owner) => console.log(`${cityId}'s major - ${owner}`));
  }
}
