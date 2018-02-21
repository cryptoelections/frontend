import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {StorageKeys} from './storage.service';
import {HttpClient} from '@angular/common/http';
import {JSON_URL} from './base.service';

const Web3 = require('web3');
const contract = require('truffle-contract');
declare var window: any;

const GAS = 300000;

@Injectable()
export class Web3Service {
  public web3;
  public accounts;
  public account;
  public accountNickname;
  public coinbase;
  public network;

  public CryptoCity;
  public contractData;

  constructor(private http: HttpClient) {
    const provider = window.web3 && window.web3.currentProvider;
    this.web3 = provider && new Web3(provider);
    if (window.web3) {
      window.web3.version.getNetwork((err, netId) => {
        this.network = parseInt(netId);

        this.http.get(`${JSON_URL}CryptoCity.json`)
          .subscribe(json => {
            this.contractData = json;
            this.CryptoCity = contract(json);
            this.CryptoCity.setProvider(provider);
          });
      });
    }
  }

  public get noMetamask() {
    return !window.web3;
  }

  public get isLocked() {
    return window.web3 && !this.coinbase;
  }

  public get isLoggedIn() {
    return !this.wrongNetwork && !!this.coinbase;
  }

  public get wrongNetwork() {
    return this.CryptoCity && this.contractData && (!this.contractData[this.network] || !this.contractData[this.network].address);
  }

  public getAccount(): Observable<any> {
    if (this.web3) {
      this.web3.eth.getCoinbase()
        .then(a => {
          this.coinbase = a;
          this.CryptoCity.defaults({from: this.coinbase, gas: GAS});
        })
        .catch((err) => Observable.of(err));

      return this.web3.eth.getAccounts((err, accs) => {
        this.accounts = accs;
        this.account = this.accounts && this.accounts[0];
        localStorage.setItem(StorageKeys.Account, JSON.stringify({address: this.coinbase, nickname: this.accountNickname}));
        if (this.CryptoCity) {
          this.getNickname(this.account)
            .then(nickname => this.accountNickname = nickname)
            .catch(error => error);
        }
        return Observable.of(this.account);
      });
    } else {
      return Observable.of(null);
    }
  }

  public setNickname(nickname: string) {
    let CryptoCityInstance;
    return this.CryptoCity.deployed()
      .then((instance) => {
        CryptoCityInstance = instance;
        CryptoCityInstance.setNickname(nickname);
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

  public invest(cityId, price) {
    let CryptoCityInstance;
    return this.CryptoCity && this.CryptoCity.deployed()
      .then((instance) => {
        CryptoCityInstance = instance;

        // todo check price of the city before buying
        // return this.getPrice(cityId).then(p => {
        return CryptoCityInstance.buyCity(cityId, {
          value: price,
          to: instance.address
        });
      });
    // });
  }

  public getUserCities(i: number) {
    let CryptoCityInstance;
    return this.CryptoCity && this.CryptoCity.deployed()
      .then((instance) => {
        CryptoCityInstance = instance;
        return CryptoCityInstance.userCities.call(this.coinbase, i);
      });
  }

  public getPrice(cityId) {
    let CryptoCityInstance;
    return this.CryptoCity && this.CryptoCity.deployed()
      .then((instance) => {
        CryptoCityInstance = instance;

        return CryptoCityInstance.getPrices(cityId);
      });
  }
}
