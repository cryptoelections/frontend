import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Effect, Actions} from '@ngrx/effects';
import {CityService} from '../../services/city.service';
import {City} from '../../models/city.model';

import * as city from './city.actions';
import {AuthService} from '../../services/auth.service';

@Injectable()
export class CityEffects {
  @Effect()
  loadCityInformation$: Observable<Action> = this.actions$
    .ofType(city.LOAD_CITY_INFORMATION_REQUEST)
    .switchMap((action: city.LoadCityInformationRequest) => this.cityService.getList()
      .map((list: Array<City>) => new city.LoadCityInformationResponse(list)));

  @Effect()
  loadDynamicCityInformation$ = this.actions$
    .ofType(city.LOAD_DYNAMIC_CITY_INFORMATION_REQUEST)
    .switchMap((action: city.LoadDynamicCityInformationRequest) => this.cityService.getDynamic()
      .map((list: Array<City>) => new city.LoadDynamicCityInformationResponse(list)));

  @Effect()
  invest$ = this.actions$
    .ofType(city.INVEST)
    .map((action: city.Invest) => this.authService.invest(action.payload.id)
      .then((res) => new city.InvestSuccess(action.payload))
      .catch((err) => Observable.of(new city.InvestError())));

  constructor(private actions$: Actions,
              private cityService: CityService,
              private authService: AuthService) {
  }
}
