import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

const Web3 = require('web3');
const contract = require('truffle-contract');
declare var window: any;

const GAS = 300000;

@Injectable()
export class AuthService {
  public web3;
  public accounts;
  public account;
  public coinbase;

  public get noMetamask() {
    return !window.web3;
  }

  public get isLocked() {
    return window.web3 && !this.coinbase;
  }

  constructor() {
    const provider = window.web3.currentProvider;
    this.web3 = provider && new Web3(provider);
  }

  public getAccount(): Observable<any> {
    if (this.web3) {
      this.web3.eth.getCoinbase()
        .then(a => {
          this.coinbase = a;
        });

      return this.web3.eth.getAccounts((err, accs) => {
        this.accounts = accs;
        this.account = this.accounts && this.accounts[0];
        return Observable.of(this.account);
      });
    } else {
      return Observable.of(null);
    }
  }
}
