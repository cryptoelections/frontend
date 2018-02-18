import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Effect, Actions} from '@ngrx/effects';
import {CityService} from '../../services/city.service';
import {City} from '../../models/city.model';
import {Web3Service} from '../../services/web3.service';

import * as city from './city.actions';

@Injectable()
export class CityEffects {
  @Effect()
  loadCityInformation$: Observable<Action> = this.actions$
    .ofType(city.LOAD_CITY_INFORMATION_REQUEST)
    .switchMap((action: city.LoadCityInformationRequest) => this.cityService.getList()
      .map((list: Array<City>) => new city.LoadCityInformationResponse(list))
      .catch((error) => Observable.of(new city.LoadCityInformationResponse([]))));

  @Effect()
  loadDynamicCityInformation$ = this.actions$
    .ofType(city.LOAD_DYNAMIC_CITY_INFORMATION_REQUEST)
    .switchMap((action: city.LoadDynamicCityInformationRequest) => this.cityService.getDynamic()
      .map((list: { [id: string]: Partial<City> }) => new city.LoadDynamicCityInformationResponse(list))
      .catch((error) => Observable.of(new city.LoadDynamicCityInformationResponse({}))));


  @Effect()
  invest$ = this.actions$
    .ofType(city.INVEST)
    .switchMap((action: city.Invest) => Observable.fromPromise(this.web3Service.invest(action.payload.id, action.payload.price))
      .map((res) => new city.InvestSuccess(action.payload.id))
      .catch((err) => Observable.of(new city.InvestError(err))));

  constructor(private actions$: Actions,
              private cityService: CityService,
              private web3Service: Web3Service) {
  }
}
