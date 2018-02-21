import {Injectable} from '@angular/core';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Effect, Actions} from '@ngrx/effects';
import {CityService} from '../../services/city.service';
import {City} from '../../models/city.model';
import {Web3Service} from '../../services/web3.service';
import {State} from '../index';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {CityModalComponent} from '../../../world/city/city-modal.component';
import * as city from './city.actions';
import * as fromCities from './city.reducers';
import * as common from '../common/common.actions';


@Injectable()
export class CityEffects {
  public bsModalRef: BsModalRef;

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
    .withLatestFrom(this.store.select(fromCities.selectEntities))
    .switchMap(([action, cities]: [city.Invest, { [id: string]: City }]) =>
      Observable.fromPromise(this.web3Service.invest(action.payload.id, action.payload.price))
        .map((res) => new city.InvestSuccess(cities[action.payload.id]))
        .catch((err) => Observable.of(new common.ShowErrorMessage(cities[action.payload.id]))));

  @Effect({dispatch: false})
  onInvestSuccess$ = this.actions$
    .ofType(city.INVEST_SUCCESS)
    .do((action: city.InvestSuccess) => {
      const initialState = {
        params: {name: action.payload.name}
      };
      this.bsModalRef = this.modalService.show(CityModalComponent, {class: 'modal-lg', initialState});
    });

  constructor(private actions$: Actions,
              private store: Store<State>,
              private cityService: CityService,
              private web3Service: Web3Service,
              private modalService: BsModalService) {
  }
}
