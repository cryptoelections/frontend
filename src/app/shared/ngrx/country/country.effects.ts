import {Injectable} from '@angular/core';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Actions, Effect} from '@ngrx/effects';
import {Country} from '../../models/country.model';
import {CountryService} from '../../services/country.service';
import {State} from '../index';
import {Web3Service} from '../../services/web3.service';

import * as country from './country.actions';

@Injectable()
export class CountryEffects {
  @Effect()
  loadCountries$: Observable<Action> = this.actions$
    .ofType(country.LOAD_COUNTRIES_REQUEST)
    .switchMap((action: country.LoadCountriesRequest) => this.countryService.getList()
      .map((list: Array<Country>) => {
        const ids = list.map(c => c.id);
        this.store.dispatch(new country.LoadDynamicCountryInformationRequest(ids));

        return new country.LoadCountriesResponse(list);
      }));

  @Effect()
  loadDynamicCountryInformation$ = this.actions$
    .ofType(country.LOAD_DYNAMIC_COUNTRY_INFORMATION_REQUEST)
    .debounceTime(2500)
    .switchMap((action: country.LoadDynamicCountryInformationRequest) => {
      return this.web3Service.CryptoElections.deployed()
        .then((instance) => instance.getCountriesData(action.payload.map(x => +x))
          .then(([presidents, slogans, flags]: Array<Array<string>>) => {
            if (presidents.length && slogans.length && flags.length) {
              return new country.LoadDynamicCountryInformationResponse(
                action.payload.reduce((m, i, k) => ({
                  ...m, [i]: {
                    president: presidents[k],
                    slogan: slogans[k],
                    flag: flags[k]
                  }
                }), {}));
            } else {
              return new country.LoadLocalDynamicCountryInformationRequest();
            }
          }));
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
