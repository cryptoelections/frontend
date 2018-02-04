import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

const Web3 = require('web3');
declare var window: any;


@Injectable()
export class AuthService {
  public web3;
  public accounts;
  public account;

  public getAccount(): Observable<any> {
    if (typeof window.web3 !== 'undefined') {
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      this.web3 = new Web3(
        new Web3.providers.HttpProvider('http://localhost:8545')
      );
    }

    return this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert('There was an error fetching your accounts.');
        return;
      }

      if (accs.length === 0) {
        alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }
      this.accounts = accs;
      this.account = this.accounts[0];
      localStorage.setItem('account', JSON.stringify(this.account));
      return Observable.of(this.account);
    });
  }
}
