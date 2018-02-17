import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AuthServiceLoader} from './auth-service.loader';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(protected router: Router,
              protected authService: AuthService,
              protected authServiceLoader: AuthServiceLoader) {
  }

  public canActivate(route: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authServiceLoader.canActivate().map(() => {
      if (this.authService.isLoggedIn) {
        return true;
      } else {
        this.router.navigate(['/metamask']);
        return false;
      }
    });
  }
}
