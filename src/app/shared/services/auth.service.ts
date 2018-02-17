import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {StorageKeys} from './storage.service';
import {HttpClient} from '@angular/common/http';
import {instantiateDefaultStyleNormalizer} from '@angular/platform-browser/animations/src/providers';

const Web3 = require('web3');
const Eth = require('ethjs');

const contract = require('truffle-contract');
const json = require('../../../data/CryptoCity.json');
declare var window: any;

export const GAS = 50000;

@Injectable()
export class AuthService {
  public web3;
  public accounts;
  public account;
  public accountNickname;
  public coinbase;

  public CryptoCity;

  constructor(private http: HttpClient) {
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
      localStorage.setItem('coinbase', JSON.stringify(a));
      this.CryptoCity.defaults({from: this.coinbase});
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
        return CryptoCityInstance.setNickname(nickname);
      });
  }

  public getNickname(address: string) {
    let CryptoCityInstance;
    return this.CryptoCity.deployed()
      .then((instance) => {
        CryptoCityInstance = instance;
        return CryptoCityInstance.userNicknames(address);
      });
  }

  public invest(cityId) {
    let CryptoCityInstance;
    return this.CryptoCity.deployed()
      .then((instance) => {
        CryptoCityInstance = instance;
        return this.getPrice(cityId).then(price => {
          return CryptoCityInstance.buyCity(cityId, {
            value: price,
            to: instance.address
          });
        });
      });
  }

  public getUserCities(i: number) {
    let CryptoCityInstance;
    return this.CryptoCity.deployed()
      .then((instance) => {
        CryptoCityInstance = instance;
        return CryptoCityInstance.userCities.call(this.coinbase, i);
      });
  }

  public getPrice(cityId) {
    let CryptoCityInstance;
    return this.CryptoCity.deployed()
      .then((instance) => {
        CryptoCityInstance = instance;

        return CryptoCityInstance.getCityPrice(cityId);
      });
  }
}
