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

@Injectable()
export class CountryEffects {
  @Effect()
  loadCountries$: Observable<Action> = this.actions$
    .ofType(country.LOAD_COUNTRIES_REQUEST)
    .switchMap((action: country.LoadCountriesRequest) => this.countryService.getList()
      .map((list: Array<Country>) => new country.LoadCountriesResponse(list)));

  @Effect()
  loadDynamicCountryInformation$ = this.actions$
    .ofType(country.LOAD_DYNAMIC_COUNTRY_INFORMATION_REQUEST)
    .debounceTime(3000)
    .withLatestFrom(this.store.select(fromCountries.selectIds))
    .switchMap(([action, countriesIds]: [country.LoadDynamicCountryInformationRequest, string[]]) => {
      return Observable.fromPromise(this.web3Service.getCountriesData(countriesIds))
        .map((dictionary: { [id: string]: Partial<Country> }) => new country.LoadDynamicCountryInformationResponse(dictionary))
        .catch((error) => {
          console.log(error);
          return Observable.of(new country.LoadDynamicCountryInformationResponse({}));
        });
    });

  constructor(private actions$: Actions,
              private store: Store<State>,
              private countryService: CountryService,
              private web3Service: Web3Service) {
  }
}
