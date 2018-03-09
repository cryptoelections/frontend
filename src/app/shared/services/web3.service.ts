import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {JSON_URL} from './base.service';
import {CountryModalContainerComponent} from '../components/country-modal.container';
import {Store} from '@ngrx/store';
import {State} from '../ngrx';
import {BsModalService} from 'ngx-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

const Web3 = require('web3');
const contract = require('truffle-contract');
declare var window: any;

const GAS = 300000;

@Injectable()
export class Web3Service {
  public web3;
  public accounts;
  public account;
  public accountNickname;
  public coinbase;
  public network;

  public CryptoElections;
  public contractData;
  public gasPrice;

  constructor(private http: HttpClient,
              private store: Store<State>,
              private modalService: BsModalService,
              private translate: TranslateService,
              private toastr: ToastrService) {
    const provider = window.web3 && window.web3.currentProvider;
    this.web3 = provider && new Web3(provider);
    this.network = undefined;
    if (provider) {
      this.web3.eth.net.getId()
        .then((netId) => {
          this.network = parseInt(netId);
          this.http.get(`${JSON_URL}CryptoElections.json`)
            .subscribe(json => {
              this.contractData = json;
              this.CryptoElections = contract(json);
              this.CryptoElections.setProvider(provider);

              this.http.get('https://ethgasstation.info/json/ethgasAPI.json')
                .subscribe((prices: any) => {
                  this.gasPrice = prices.average * 100000000;
                });

              setTimeout(() => this.getAccount(), 2000);
            });
        });
    }
  }

  public get isLoggedIn() {
    return !this.wrongNetwork && !!this.coinbase;
  }

  public get wrongNetwork() {
    return !this.CryptoElections && !this.network
      || this.CryptoElections && this.contractData
      && (!this.contractData.networks[this.network] || !this.contractData.networks[this.network].address);
  }

  public getAccount(): Observable<any> {
    if (this.web3) {
      this.web3.eth.getCoinbase()
        .then(a => {
          this.coinbase = a;
          if (this.CryptoElections) {
            this.CryptoElections.defaults({from: this.coinbase, gas: GAS, gasPrice: this.gasPrice});

            this.CryptoElections.deployed()
              .then(instance => instance.assignCountryEvent()
                .watch((error, result) => {
                  const previous = sessionStorage.getItem('congrats') && JSON.parse(sessionStorage.getItem('congrats')) || [];
                  const alreadyShown = !!previous.find((c) => c.transactionIndex === result.transactionIndex && c.args === result.args);
                  if (result && !alreadyShown) {
                    if (result.args.user === this.coinbase) {
                      const initialState = {
                        countryId: parseInt(result.args.countryId)
                      };
                      window['yaCounter47748901'].reachGoal('countryassignevent');
                      sessionStorage.setItem('congrats', JSON.stringify([...previous, result]));
                      this.modalService.show(CountryModalContainerComponent, {class: 'modal-lg', initialState});
                    }
                  }
                }))
              .catch(() => {
              });
          }
        });

      return this.web3.eth.getAccounts((err, accs) => {
        this.accounts = accs;
        this.account = this.accounts && this.accounts[0];
        if (this.CryptoElections) {
          setInterval(() => this.getNickname(this.account)
            .then(nickname => this.accountNickname = nickname)
            .catch(error => error), 5000);
        }
        return Observable.of(this.account);
      });
    } else {
      return Observable.of(null);
    }
  }

  public setNickname(nickname: string) {
    let CryptoElectionsInstance;
    return this.CryptoElections.deployed()
      .then((instance) => {
        CryptoElectionsInstance = instance;
        window['amplitude'].getInstance().logEvent('set_nickname');

        CryptoElectionsInstance.setNickname(nickname)
          .then((success) => {
            this.toastr.success(this.translate.instant('SUCCESS.NICKNAME_WAS_SET'));
          }).catch(error => {
          window['amplitude'].getInstance().logEvent('error_set_nickname');
          this.toastr.error(this.translate.instant('ERRORS.NICKNAME_WAS_NOT_SET'));
        });
      }).catch(error => this.toastr.error(this.translate.instant('ERRORS.NICKNAME_WAS_NOT_SET')));
  }

  public getNickname(address: string) {
    let CryptoElectionsInstance;
    return this.CryptoElections.deployed()
      .then((instance) => {
        CryptoElectionsInstance = instance;
        return CryptoElectionsInstance.userNicknames(address);
      });
  }

  public contract(): Promise<any> {
    return this.CryptoElections.deployed;
  }
}
