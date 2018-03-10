import {Injectable} from '@angular/core';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Effect, Actions} from '@ngrx/effects';
import {CityService} from '../../services/city.service';
import {City} from '../../models/city.model';
import {Web3Service} from '../../services/web3.service';
import {State} from '../index';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {CityModalComponent} from '../../components/city-modal.component';
import * as city from './city.actions';
import * as fromCities from './city.reducers';
import * as common from '../common/common.actions';


@Injectable()
export class CityEffects {
  public bsModalRef: BsModalRef;

  @Effect()
  loadCityInformation$: Observable<Action | Action[]> = this.actions$
    .ofType(city.LOAD_CITY_INFORMATION_REQUEST)
    .switchMap((action: city.LoadCityInformationRequest) => this.cityService.getList()
      .map((list: Array<City>) => {
        return new city.LoadCityInformationResponse(list);
      })
      .catch((error) => Observable.of(new city.LoadCityInformationResponse([]))));

  @Effect()
  loadDynamicCityInformation$ = this.actions$
    .ofType(city.LOAD_DYNAMIC_CITY_INFORMATION_REQUEST)
    .debounceTime(2500)
    .withLatestFrom(this.store.select(fromCities.selectIds))
    .switchMap(([action, cityIds]: [city.LoadCityInformationRequest, string[]]) => {
      const ids = cityIds.map(id => parseInt(id));
      if (ids.length > 0) {
        return this.web3Service.CryptoElections.deployed()
          .then((instance) => instance.getCitiesData(ids)
            .then(([mayors, purchases, startPrices, multiplierSteps]: Array<Array<string>>) => {
              return new city.LoadDynamicCityInformationResponse(ids.reduce((m, i, k) => ({
                ...m, [i]: {
                  mayor: mayors[k],
                  purchases: parseInt(purchases[k]),
                  startPrice: parseInt(startPrices[k]),
                  multiplierStep: parseInt(multiplierSteps[k]),
                  price: this.calculateCityPrice(parseInt(purchases[k]), parseInt(startPrices[k]), parseInt(multiplierSteps[k]))
                }
              }), {}));
            }));
      } else {
        return new city.LoadLocalDynamicCityInformationRequest();
      }
    }).catch((error) => {
      return Observable.of(new city.LoadLocalDynamicCityInformationRequest());
    });

  @Effect()
  loadLocalDynamicCityInformation$ = this.actions$
    .ofType(city.LOAD_LOCAL_DYNAMIC_CITY_INFORMATION_REQUEST)
    .withLatestFrom(this.store.select(fromCities.selectEntities),
      this.store.select(fromCities.getDynamicInfoEntities))
    .switchMap(([action, cities, dynamics]: [city.LoadCityInformationRequest,
      { [id: string]: City }, { [id: string]: City }]) => this.cityService.getDynamic()
      .then((dictionary: { [id: string]: Partial<City> }) => {
        return new city.LoadDynamicCityInformationResponse(dictionary);
      }))
    .catch((error) => {
      return Observable.of(new city.LoadDynamicCityInformationResponse({}));
    });

  @Effect()
  invest$ = this.actions$
    .ofType(city.INVEST)
    .withLatestFrom(this.store.select(fromCities.selectEntities))
    .flatMap(([action, cities]: [city.Invest, { [id: string]: City }]) => {
      window['yaCounter47748901'].reachGoal('investbutton');
      window['amplitude'].getInstance().logEvent('invest_button');

      return this.web3Service.CryptoElections.deployed()
        .then((instance) => {
          return instance.cities(action.payload.id)
            .then((c) => {
              const price = this.calculateCityPrice(parseInt(c[3]), parseInt(c[4]), parseInt(c[5]));
              return instance.buyCity(action.payload.id, {
                value: price,
                to: instance.address
              });
            })
            .then((res) => new city.InvestSuccess(cities[action.payload.id]));
        }).catch((err) => {
          return new common.ShowErrorMessage(cities[action.payload.id]);
        });
    });

  @Effect({dispatch: false})
  onInvestSuccess$ = this.actions$
    .ofType(city.INVEST_SUCCESS)
    .do((action: city.InvestSuccess) => {
      window['yaCounter47748901'].reachGoal('citybuyevent');
      window['amplitude'].getInstance().logEvent('city_buy_event');

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


  private calculateCityPrice(purchases: number, startPrice: number, multiplierStep: number): number {
    let price = startPrice;

    for (let i = 1; i <= purchases; i++) {
      if (i <= multiplierStep) {
        price = price * 2;
      } else {
        price = (price * 12) / 10;
      }
    }
    return price;
  }
}
