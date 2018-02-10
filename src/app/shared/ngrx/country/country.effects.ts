import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Effect, Actions } from '@ngrx/effects'

import * as country from './country.actions';
import { Country } from '../../models/country.model';
import { CountryService } from '../../services/country.service';

@Injectable()
export class CountryEffects {
  @Effect()
  loadCountries$: Observable<Action> = this.actions$
    .ofType(country.LOAD_COUNTRIES_REQUEST)
    .switchMap((action: country.LoadCountriesRequest) => this.countryService.getList()
      .map((list: Array<Country>) => new country.LoadCountriesResponse(list)));

  constructor(private actions$: Actions, private countryService: CountryService) {
  }
}
