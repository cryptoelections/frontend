import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Effect, Actions} from '@ngrx/effects';
import {AuthService} from '../../services/auth.service';

import * as myCampaignActions from './my-campaign.actions';

@Injectable()
export class MyCampaignEffects {
  @Effect()
  loadMyCities$: Observable<Action> = this.actions$
    .ofType(myCampaignActions.LOAD_MY_CITIES_REQUEST)
    .flatMap((action: myCampaignActions.LoadMyCitiesRequest) => {
      const i = action.payload || 0;
      let actions = [new myCampaignActions.AddNoMoreCities()];
      return Observable.fromPromise(this.authService.getUserCities(i))
        .flatMap((city) => {
          if (city['c'][0] !== 0) {
            actions = [
              new myCampaignActions.AddMyCity( city['c'][0].toString()),
              new myCampaignActions.LoadMyCitiesRequest(i + 1)
            ];
          }

          return actions;
        });
    });

  constructor(private actions$: Actions,
              private authService: AuthService) {
  }
}
