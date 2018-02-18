import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Effect, Actions} from '@ngrx/effects';
import {Country} from '../../models/country.model';
import {CountryService} from '../../services/country.service';

import * as country from './country.actions';

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
    .switchMap((action: country.LoadDynamicCountryInformationRequest) => this.countryService.getDynamic()
      .map((dictionary: { [id: string]: Partial<Country> }) => new country.LoadDynamicCountryInformationResponse(dictionary))
      .catch((error) => Observable.of(new country.LoadDynamicCountryInformationResponse({}))));

  constructor(private actions$: Actions, private countryService: CountryService) {
  }
}
