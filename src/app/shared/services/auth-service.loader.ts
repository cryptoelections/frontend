import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Web3Service } from './web3.service';


@Injectable()
export class AuthServiceLoader implements CanActivate {
  private _isLoading: Observable<boolean>;

  constructor(private web3Service: Web3Service,
              private router: Router) {
  }

  public canActivate(): any {
    if (!this.web3Service.isLoggedIn) {
      this.router.navigate(['/metamask']);
      return Observable.of(false);
    }

    if (this.web3Service.account) {
      return Observable.from([true]);
    } else {
      return this._load();
    }
  }

  private _load() {
    if (!this._isLoading) {
      this._isLoading = this.web3Service.getAccount()
        .map((user) => {
          this.web3Service.coinbase = user;
          this._isLoading = null;
          return true;
        }).share();
    }

    return this._isLoading;
  }
}
