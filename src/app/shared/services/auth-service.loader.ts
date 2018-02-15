import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';


@Injectable()
export class AuthServiceLoader implements CanActivate {
  private _isLoading: Observable<boolean>;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  public canActivate(): any {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/metamask']);
      return Observable.of(false);
    }

    if (this.authService.account) {
      return Observable.from([true]);
    } else {
      return this._load();
    }
  }

  private _load() {
    if (!this._isLoading) {
      this._isLoading = this.authService.getAccount()
        .map((user) => {
          this.authService.account = user;
          this._isLoading = null;
          return true;
        }).share();
    }

    return this._isLoading;
  }
}
