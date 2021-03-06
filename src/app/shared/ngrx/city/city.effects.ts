import {Injectable} from '@angular/core';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Actions, Effect} from '@ngrx/effects';
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
        const ids = list.map(c => c.id);
        this.store.dispatch(new city.LoadDynamicCityInformationRequest(ids));
        return new city.LoadCityInformationResponse(list);
      })
      .catch((error) => Observable.of(new city.LoadCityInformationResponse([]))));

  @Effect()
  loadDynamicCityInformation$ = this.actions$
    .ofType(city.LOAD_DYNAMIC_CITY_INFORMATION_REQUEST)
    .debounceTime(2500)
    .switchMap((action: city.LoadDynamicCityInformationRequest) => {
      return this.web3Service.CryptoElections.deployed()
        .then((instance) => instance.getCitiesData(action.payload.map(x => +x))
          .then(([mayors, purchases, startPrices, multiplierSteps]: Array<Array<string>>) => {
            console.log(action.payload.map(x => +x), mayors, purchases.map(x => parseInt(x)),
              startPrices.map(x => parseInt(x)), multiplierSteps.map(x => parseInt(x)));
            if (mayors.length && purchases.length && startPrices.length && multiplierSteps.length) {
              return new city.LoadDynamicCityInformationResponse(action.payload.reduce((m, i, k) => ({
                ...m, [i]: {
                  mayor: mayors[k],
                  purchases: parseInt(purchases[k]),
                  price: this.calculateCityPrice(i, parseInt(purchases[k]), parseInt(startPrices[k]), parseInt(multiplierSteps[k]))
                }
              }), {}));
            } else {
              return new city.LoadLocalDynamicCityInformationRequest();
            }
          }));
    }).catch((error) => {
      console.log('dynamic loading error:', error);
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
      console.log('local dynamic loading error:', error);
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
              const price = this.calculateCityPrice(action.payload.id, parseInt(c[3]), parseInt(c[4]), parseInt(c[5]));
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


  private calculateCityPrice(id, purchases: number, startPrice: number, multiplierStep: number): number {
    let price = startPrice;

    for (let i = 1; i <= purchases; i++) {
      if (i <= multiplierStep) {
        price = price * 2;
      } else {
        price = (price * 12) / 10;
      }
    }
    console.log(id, purchases, startPrice, multiplierStep, 'price =>', price);
    return price;
  }
}
