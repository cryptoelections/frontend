import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Effect, Actions} from '@ngrx/effects';
import {Web3Service} from '../../services/web3.service';

import * as myCampaignActions from './my-campaign.actions';

@Injectable()
export class MyCampaignEffects {
  @Effect()
  loadMyCities$: Observable<Action> = this.actions$
    .ofType(myCampaignActions.LOAD_MY_CITIES_REQUEST)
    .filter((action: myCampaignActions.LoadMyCitiesRequest) => this.web3Service.isLoggedIn)
    .flatMap((action: myCampaignActions.LoadMyCitiesRequest) => {
      let i = action.payload || 0;
      let actions = [new myCampaignActions.AddNoMoreCities()];
      return Observable.fromPromise(this.web3Service.getUserCities(i))
        .flatMap((city) => {
          if (city['c'][0] !== 0) {
            i++;
            actions = [
              new myCampaignActions.AddMyCity(city['c'][0].toString()),
              new myCampaignActions.LoadMyCitiesRequest(i)
            ];
          }

          return actions;
        }).catch(err => Observable.of(new myCampaignActions.AddNoMoreCities()));
    });

  constructor(private actions$: Actions,
              private web3Service: Web3Service) {
  }
}
