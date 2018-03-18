import {Injectable} from '@angular/core';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Effect, Actions} from '@ngrx/effects';
import {Country} from '../../models/country.model';
import {CountryService} from '../../services/country.service';
import {State} from '../index';
import {Web3Service} from '../../services/web3.service';

import * as country from './country.actions';
import * as fromCountries from './country.reducers';
import * as fromCities from '../city/city.reducers';
import * as city from '../city/city.actions';

@Injectable()
export class CountryEffects {
  @Effect()
  loadCountries$: Observable<Action> = this.actions$
    .ofType(country.LOAD_COUNTRIES_REQUEST)
    .switchMap((action: country.LoadCountriesRequest) => this.countryService.getList()
      .map((list: Array<Country>) => {
        const ids = list.map(c => c.id);
        this.store.dispatch(new country.LoadDynamicCountryInformationRequest(<string[]>ids));
        setInterval(() => this.store.dispatch(new country.LoadDynamicCountryInformationRequest(<string[]>ids)), 180000);

        return new country.LoadCountriesResponse(list);
      }));

  @Effect()
  loadDynamicCountryInformation$ = this.actions$
    .ofType(country.LOAD_DYNAMIC_COUNTRY_INFORMATION_REQUEST)
    .debounceTime(2500)
    .switchMap((action: country.LoadDynamicCountryInformationRequest) => {
      return this.web3Service.CryptoElections.deployed()
        .then((instance) => instance.getCountriesData(action.payload.map(x => parseInt(x)))
          .then(([presidents, slogans, flags]: Array<Array<string>>) => new country.LoadDynamicCountryInformationResponse(
            action.payload.reduce((m, i, k) => ({
              ...m, [i]: {
                president: presidents[k],
                slogan: slogans[k],
                flag: flags[k]
              }
            }), {}))));
    })
    .catch((error) => {
      console.log('loading dynamic of countries:', error);
      return Observable.of(new country.LoadLocalDynamicCountryInformationRequest());
    });

  @Effect()
  loadLocalDynamicCountryInformation$ = this.actions$
    .ofType(country.LOAD_LOCAL_DYNAMIC_COUNTRY_INFO_REQUEST)
    .switchMap((actions: country.LoadLocalDynamicCountryInformationRequest) => this.countryService.getDynamic()
      .then((dictionary: { [id: string]: Partial<Country> }) => new country.LoadDynamicCountryInformationResponse(dictionary))
      .catch((error) => {
        console.log('loading local dynamic of countries:', error);
        return Observable.of(new country.LoadDynamicCountryInformationResponse({}));
      }));

  constructor(private actions$: Actions,
              private store: Store<State>,
              private countryService: CountryService,
              private web3Service: Web3Service) {
  }
}
