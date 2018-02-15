import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Effect, Actions } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import { CityService } from '../../services/city.service';
import { City } from '../../models/city.model';

import * as myCampaignActions from './my-campaign.actions';

@Injectable()
export class MyCampaignEffects {
  @Effect()
  loadMyCities$: Observable<Action> = this.actions$
    .ofType(myCampaignActions.LOAD_MY_CITIES_REQUEST)
    .switchMap((action: myCampaignActions.LoadMyCitiesRequest) => this.authService.getUserCities()
      .then((list: Array<City>) => new myCampaignActions.LoadMyCitiesResponse(
        list.map((c: City) => `${c.country}-${c.name}`))));

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {
  }
}
