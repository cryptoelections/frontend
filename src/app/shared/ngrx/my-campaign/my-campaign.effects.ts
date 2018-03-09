import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Effect, Actions} from '@ngrx/effects';
import {Web3Service} from '../../services/web3.service';
import {AuthService} from '../../services/auth.service';

import * as myCampaignActions from './my-campaign.actions';

@Injectable()
export class MyCampaignEffects {
  @Effect()
  loadMyCities$: Observable<Action> = this.actions$
    .ofType(myCampaignActions.LOAD_MY_CITIES_REQUEST)
    .debounceTime(3000)
    .filter((action: myCampaignActions.LoadMyCitiesRequest) => this.authService.coinbase && !this.web3Service.wrongNetwork)
    .flatMap((action: myCampaignActions.LoadMyCitiesRequest) => {
      return this.web3Service.CryptoElections.deployed()
        .then(instance => instance.getUserCities(this.web3Service.coinbase))
        .then(response => new myCampaignActions.LoadMyCitiesResponse(response.map(x => parseInt(x))))
        .catch(err => new myCampaignActions.AddNoMoreCities());
    });

  constructor(private actions$: Actions,
              private authService: AuthService,
              private web3Service: Web3Service) {
  }
}
