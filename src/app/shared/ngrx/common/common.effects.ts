import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {Web3Service} from '../../services/web3.service';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {State} from '../index';
import {Store} from '@ngrx/store';
import {Country} from '../../models/country.model';
import {zeroAddress} from '../../../world/country/country-card.component';

import * as commonActions from './common.actions';
import * as cityActions from '../city/city.actions';
import * as countryActions from '../country/country.actions';
import * as myCampaignActions from '../my-campaign/my-campaign.actions';
import * as fromNicknames from '../nicknames/nicknames.reducers';
import * as fromCountries from '../country/country.reducers';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class CommonEffects {
  @Effect()
  loadWalletData$ = this.actions$
    .ofType(commonActions.LOAD_WALLET_DATA_REQUEST)
    .debounceTime(3000)
    .switchMap((action: commonActions.LoadWalletDataRequest) => {
      return this.web3Service.CryptoElections.deployed()
        .then((instance) => instance.userPendingWithdrawals(this.web3Service.coinbase))
        .then(x => {
          if (window && window['amplitude']) {
            window['amplitude'].getInstance().logEvent('withdraw', {balance: x});
          }
          return new commonActions.LoadWalletDataResponse(parseInt(x));
        });
    }).catch(err => Observable.of(new commonActions.LoadWalletDataResponse(0)));

  @Effect()
  withdraw$ = this.actions$
    .ofType(commonActions.WITHDRAW_REQUEST)
    .switchMap((action: commonActions.WithdrawRequest) => {
      return this.web3Service.CryptoElections.deployed()
        .then((instance) => instance.withdraw())
        .then(x => new commonActions.WithdrawSuccess(x)).catch(err => new commonActions.WithdrawError(err))
        .catch(x => this.toastr.error('ERRORS.WITHDRAWAL_UNSUCCESSFULL'));
    }).catch(x => Observable.of(new commonActions.ShowErrorMessage('ERRORS.WITHDRAWAL_UNSUCCESSFULL')));

  @Effect()
  loadAllInfo$ = this.actions$
    .ofType(commonActions.LOAD_ALL)
    .flatMap((action: commonActions.LoadAllData) => [
      new cityActions.LoadCityInformationRequest(),
      new cityActions.LoadDynamicCityInformationRequest(),
      new countryActions.LoadCountriesRequest(),
      new countryActions.LoadDynamicCountryInformationRequest(),
      new myCampaignActions.LoadMyCitiesRequest(),
      new commonActions.TurnOnNotifications()
    ]);

  @Effect({dispatch: false})
  showNotification$ = this.actions$
    .ofType(commonActions.ADD_NEW_MESSAGE)
    .withLatestFrom(this.store.select(fromNicknames.selectEntities),
      this.store.select(fromCountries.selectEntities))
    .do(([action, nicknames, countries]: [commonActions.AddNewMessage, { [address: string]: string }, { [id: number]: Country }]) => {
      this.toastr.info(this.translate.instant('NOTIFICATIONS.PRESIDENT', {
        user: action.payload.address && (nicknames[action.payload.address] || action.payload.address),
        country: countries[action.payload.country] && countries[action.payload.country].name
      }));
    });

  @Effect({dispatch: false})
  turnOnNotifications$ = this.actions$
    .ofType(commonActions.TURN_ON_NOTIFICATIONS)
    .withLatestFrom(this.store.select(fromCountries.selectAll),
      this.store.select(fromCountries.getDynamicCountriesState))
    .do(([action, countries, dynamic]) => {
      countries.forEach(country => setInterval(() => {
        if (dynamic[country.id] && dynamic[country.id].president && dynamic[country.id].president !== zeroAddress) {
          this.store.dispatch(new commonActions.AddNewMessage({
            address: dynamic[country.id].president,
            country: country.id
          }));
        }
      }, 30000));
    });

  @Effect({dispatch: false})
  showError$ = this.actions$
    .ofType(commonActions.SHOW_ERROR)
    .do((action: commonActions.ShowErrorMessage) => {
      this.toastr.error(this.translate.instant(action.payload.name ? 'ERRORS.UNSUCCESSFUL_TRANSACTION' : action.payload,
        {name: action.payload.name}));
    });

  constructor(private actions$: Actions,
              private store: Store<State>,
              private web3Service: Web3Service,
              private translate: TranslateService,
              private toastr: ToastrService) {
  }
}
