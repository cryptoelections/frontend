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

  public CryptoElections;
  public contractData;

  constructor(private http: HttpClient) {
    const provider = window.web3 && window.web3.currentProvider;
    this.web3 = provider && new Web3(provider);
    if (window.web3) {
      window.web3.version.getNetwork((err, netId) => {
        this.network = parseInt(netId);

        this.http.get(`${JSON_URL}CryptoElections.json`)
          .subscribe(json => {
            this.contractData = json;
            this.CryptoElections = contract(json);
            this.CryptoElections.setProvider(provider);
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
    return this.CryptoElections
      && this.contractData
      && (!this.contractData.networks[this.network] || !this.contractData.networks[this.network].address);
  }

  public getAccount(): Observable<any> {
    if (this.web3) {
      this.web3.eth.getCoinbase()
        .then(a => {
          this.coinbase = a;
          this.CryptoElections.defaults({from: this.coinbase, gas: GAS});
        })
        .catch((err) => Observable.of(err));

      return this.web3.eth.getAccounts((err, accs) => {
        this.accounts = accs;
        this.account = this.accounts && this.accounts[0];
        localStorage.setItem(StorageKeys.Account, JSON.stringify({address: this.coinbase, nickname: this.accountNickname}));
        if (this.CryptoElections) {
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
    let CryptoElectionsInstance;
    return this.CryptoElections.deployed()
      .then((instance) => {
        CryptoElectionsInstance = instance;
        CryptoElectionsInstance.setNickname(nickname);
      });
  }

  public getNickname(address: string) {
    let CryptoElectionsInstance;
    return this.CryptoElections.deployed()
      .then((instance) => {
        CryptoElectionsInstance = instance;
        return CryptoElectionsInstance.userNicknames(address);
      });
  }

  public invest(cityId, price) {
    let CryptoElectionsInstance;
    return this.CryptoElections && this.CryptoElections.deployed()
      .then((instance) => {
        CryptoElectionsInstance = instance;

        // todo check price of the city before buying
        // return this.getPrice(cityId).then(p => {
        return CryptoElectionsInstance.buyCity(cityId, {
          value: price,
          to: instance.address
        });
      });
    // });
  }

  public getUserCities(i: number) {
    let CryptoElectionsInstance;
    return this.CryptoElections && this.CryptoElections.deployed()
      .then((instance) => {
        CryptoElectionsInstance = instance;
        return CryptoElectionsInstance.userCities.call(this.coinbase, i);
      });
  }

  public getPrice(cityId) {
    let CryptoElectionsInstance;
    return this.CryptoElections && this.CryptoElections.deployed()
      .then((instance) => {
        CryptoElectionsInstance = instance;

        return CryptoElectionsInstance.getPrices(cityId);
      });
  }
}
