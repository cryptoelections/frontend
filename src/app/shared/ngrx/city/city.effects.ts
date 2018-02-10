import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Effect, Actions } from '@ngrx/effects'
import { CityService } from '../../services/city.service';
import { City } from '../../models/city.model';

import * as city from './city.actions';

@Injectable()
export class CityEffects {
  @Effect()
  loadCountries$: Observable<Action> = this.actions$
    .ofType(city.LOAD_CITIES_REQUEST)
    .switchMap((action: city.LoadCitiesRequest) => this.cityService.getList()
      .map((list: Array<City>) => new city.LoadCitiesResponse(list)));

  constructor(private actions$: Actions,
              private cityService: CityService) {
  }
}
