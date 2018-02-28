import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {JSON_URL} from './base.service';
import {CountryModalContainerComponent} from '../components/country-modal.container';
import {Store} from '@ngrx/store';
import {State} from '../ngrx';
import {BsModalService} from 'ngx-bootstrap';

import * as common from '../ngrx/common/common.actions';

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

  constructor(private http: HttpClient, private store: Store<State>, private modalService: BsModalService) {
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
                    } else {
                      this.store.dispatch(new common.AddNewMessage({
                        address: result.args.address,
                        country: parseInt(result.args.countryId)
                      }));
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
        CryptoElectionsInstance.setNickname(nickname);
      });
  }

  public getNickname(address: string) {
    let CryptoElectionsInstance;
    return this.CryptoElections.deployed()
      .then((instance) => {
        CryptoElectionsInstance = instance;
        return CryptoElectionsInstance.userNicknames(address);
      });
  }

  public invest(cityId, price) {
    let CryptoElectionsInstance;
    return this.CryptoElections && this.CryptoElections.deployed()
      .then((instance) => {
        CryptoElectionsInstance = instance;
        return this.getCityInfo(cityId)
          .then((city) => {
            const p = this.getPrices(city[3]) * 1000000000000000000 || price;
            // if (window['fbq']) {
            //   window['fbq']('track', 'Purchase', {
            //     value: p,
            //     currency: 'EUR'
            //   });
            // }
            return CryptoElectionsInstance.buyCity(cityId, {
              value: p,
              to: instance.address
            });
          });
      });
  }

  public getUserCities() {
    let CryptoElectionsInstance;

    return this.CryptoElections ? this.CryptoElections.deployed()
      .then(instance => {
        CryptoElectionsInstance = instance;
        return CryptoElectionsInstance.getUserCities(this.coinbase);
      }) : new Promise(resolve => []);
  }

  public getCityInfo(cityId) {
    let CryptoElectionsInstance;
    return this.CryptoElections && this.CryptoElections.deployed()
      .then((instance) => {
        CryptoElectionsInstance = instance;

        return CryptoElectionsInstance.cities(cityId);
      });
  }

  public loadWalletData() {
    let CryptoElectionsInstance;
    return this.CryptoElections ? this.CryptoElections.deployed()
      .then((instance) => {
        CryptoElectionsInstance = instance;
        return CryptoElectionsInstance.userPendingWithdrawals(this.coinbase);
      }) : new Promise(resolve => {
      return 0;
    });
  }

  public withdraw() {
    let CryptoElectionsInstance;
    return this.CryptoElections && this.CryptoElections.deployed()
      .then((instance) => {
        CryptoElectionsInstance = instance;
        return CryptoElectionsInstance.withdraw();
      });
  }

  private getPrices(purchases) {
    let price = 0.02;

    for (let i = 1; i <= purchases; i++) {
      if (i <= 7) {
        price = price * 2;
      } else {
        price = price * 1.2;
      }
    }
    return price;
  }
}
