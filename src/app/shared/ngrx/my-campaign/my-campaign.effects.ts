import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Actions, Effect} from '@ngrx/effects';
import {Web3Service} from '../../services/web3.service';
import {AuthService} from '../../services/auth.service';
import {State} from '../index';

import * as myCampaignActions from './my-campaign.actions';
import * as fromCities from '../city/city.reducers';

@Injectable()
export class MyCampaignEffects {
  @Effect()
  loadMyCities$ = this.actions$
    .ofType(myCampaignActions.LOAD_MY_CITIES_REQUEST)
    .debounceTime(5000)
    .withLatestFrom(this.store.select(fromCities.getDynamicInfoEntities))
    .filter(([action, cities]: [myCampaignActions.LoadMyCitiesRequest, any]) =>
      this.authService.coinbase && !this.web3Service.wrongNetwork)
    .switchMap(([action, cities]: [myCampaignActions.LoadMyCitiesRequest, any]) => {
      return this.web3Service.CryptoElections.deployed()
        .then(instance => instance.getUserCities(this.web3Service.coinbase)
          .then(response => {
            let list = [];
            if (!response || !response.length) {
              list = Object.entries(cities)
                .filter(([key, value]) => value.mayor === this.web3Service.coinbase)
                .map(([key, value]) => key);
            } else {
              list = response.map(x => parseInt(x));
            }
            return new myCampaignActions.LoadMyCitiesResponse(list);
          })
          .catch(err => {
            return new myCampaignActions.AddNoMoreCities();
          }));
    }).catch(err => {
      return Observable.of(new myCampaignActions.AddNoMoreCities());
    });

  constructor(private store: Store<State>,
              private actions$: Actions,
              private authService: AuthService,
              private web3Service: Web3Service) {
  }
}
