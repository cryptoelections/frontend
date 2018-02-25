import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {Web3Service} from '../../services/web3.service';
import {BsModalService} from 'ngx-bootstrap';


import * as commonActions from './common.actions';

@Injectable()
export class CommonEffects {
  @Effect()
  loadWalletData$ = this.actions$
    .ofType(commonActions.LOAD_WALLET_DATA_REQUEST)
    .debounceTime(1000)
    .switchMap((action: commonActions.LoadWalletDataRequest) => {
      return this.web3Service.loadWalletData().then(x => new commonActions.LoadWalletDataResponse(parseInt(x)));
    });

  @Effect()
  withdraw$ = this.actions$
    .ofType(commonActions.WITHDRAW_REQUEST)
    .switchMap((action: commonActions.WithdrawRequest) => {
      return this.web3Service.withdraw().then(x => new commonActions.WithdrawSuccess(x)).catch(err => new commonActions.WithdrawError(err));
    });

  constructor(private actions$: Actions,
              private web3Service: Web3Service,
              private modalService: BsModalService) {

  }
}
