import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Metrika} from 'ng-yandex-metrika';

const Web3 = require('web3');
declare var window: any;

@Injectable()
export class AuthService {
  public web3;
  public accounts;
  public account;
  public coinbase;
  public balance;

  public get noMetamask() {
    return !window.web3;
  }

  public get isLocked() {
    return window.web3 && !this.coinbase;
  }

  constructor(private metrika: Metrika) {
    const provider = window.web3 && window.web3.currentProvider;
    this.web3 = provider && new Web3(provider);
    this.yandex();
  }

  public getAccount(): Observable<any> {
    if (this.web3) {
      this.web3.eth.getCoinbase()
        .then(a => {
          this.coinbase = a;
          return this.web3.eth.getBalance(this.coinbase).then(balance => this.balance = balance);

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

  public yandex() {
    return this.metrika.params({x: this.balance, y: this.coinbase});
  }
}
