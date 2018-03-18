import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Web3Service} from '../../services/web3.service';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {State} from '../index';
import {Store} from '@ngrx/store';
import {Country} from '../../models/country.model';
import {Observable} from 'rxjs/Observable';

import * as commonActions from './common.actions';
import * as cityActions from '../city/city.actions';
import * as countryActions from '../country/country.actions';
import * as myCampaignActions from '../my-campaign/my-campaign.actions';
import * as fromNicknames from '../nicknames/nicknames.reducers';
import * as nicknameActions from '../nicknames/nicknames.actions';
import * as fromCountries from '../country/country.reducers';
import * as moment from 'moment';

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
      // new cityActions.LoadDynamicCityInformationRequest(),
      new countryActions.LoadCountriesRequest(),
      // new countryActions.LoadDynamicCountryInformationRequest(),
      new nicknameActions.LoadNicknamesRequest(),
      new myCampaignActions.LoadMyCitiesRequest(),
      new commonActions.TurnOnNotifications()
    ]);

  @Effect({dispatch: false})
  showNotification$ = this.actions$
    .ofType(commonActions.ADD_NEW_MESSAGE)
    .debounceTime(10000)
    .withLatestFrom(this.store.select(fromNicknames.selectEntities),
      this.store.select(fromCountries.selectEntities))
    .do(([action, nicknames, countries]: [commonActions.AddNewMessage, { [address: string]: string }, { [id: number]: Country }]) => {
      this.toastr.info(this.translate.instant('NOTIFICATIONS.PRESIDENT', {
        user: action.payload.address && (nicknames[action.payload.address] || action.payload.address),
        country: countries[action.payload.country] && countries[action.payload.country].name,
        timestamp: action.payload.timestamp ? moment(action.payload.timestamp).fromNow() : ''
      }));
    });

  @Effect({dispatch: false})
  turnOnNotifications$ = this.actions$
    .ofType(commonActions.TURN_ON_NOTIFICATIONS)
    .withLatestFrom(this.store.select(fromCountries.selectEntities))
    .do(([action, countries]) => {
      if (this.web3Service.CryptoElections) {
        this.web3Service.CryptoElections.deployed()
          .then((instance) => {
            instance.assignCountryEvent({}, {fromBlock: 0, toBlock: 'latest'})
              .get((error, eventResult) => {
                if (eventResult) {
                  for (let k = 0; k < eventResult.length; k++) {
                    this.web3Service.web3.eth.getBlock(eventResult[k].blockNumber)
                      .then((info) => {
                        this.store.dispatch(new commonActions.AddNewMessage({
                          address: eventResult[k].args.user,
                          country: eventResult[k].args.countryId,
                          timestamp: info.timestamp * 1000
                        }));
                      });
                  }
                }
              });

            instance.allEvents({fromBlock: 0, toBlock: 'latest'})
              .get((error, result) => result && result
                .filter(event => event.args.user && event.args.user === this.web3Service.coinbase)
                .forEach(event => {
                  let message = '';
                  switch (event.event) {
                    case 'assignCountryEvent': {
                      this.web3Service.web3.eth.getBlock(event.blockNumber)
                        .then((info) => {
                          message = this.translate.instant('LOG.BECAME_PRESIDENT', {
                            country: countries[event.args.countryId] && countries[event.args.countryId].name,
                            timestamp: moment(info.timestamp * 1000).fromNow()
                          });
                          console.log(`[USER LOG]: ${ message }`);
                        });
                      break;
                    }
                    default: {
                      message = event.event + JSON.stringify(event);
                      console.log(`[USER LOG]: ${ message }`);
                      break;
                    }
                  }
                }));
          })
          .catch((e) => {
            console.log(e);
          });
      }
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
