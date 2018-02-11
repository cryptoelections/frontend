import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Effect, Actions } from '@ngrx/effects'
import { CityService } from '../../services/city.service';
import { City } from '../../models/city.model';

import * as myCampaignActions from './my-campaign.actions';

@Injectable()
export class MyCampaignEffects {
  @Effect()
  loadMyCities$: Observable<Action> = this.actions$
    .ofType(myCampaignActions.LOAD_MY_CITIES_REQUEST)
    .switchMap((action: myCampaignActions.LoadMyCitiesRequest) => this.cityService.getList()
      .map((list: Array<City>) => new myCampaignActions.LoadMyCitiesResponse(
        list.map((c: City) => `${c.country}-${c.name}`)))); // todo change to real get method

  constructor(private actions$: Actions,
              private cityService: CityService) {
  }
}
