import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../../shared/ngrx';
import {City} from '../../shared/models/city.model';

import * as fromMyCampaign from '../../shared/ngrx/my-campaign/my-campaign.reducers';
import * as fromCountries from '../../shared/ngrx/country/country.reducers';
import * as fromCities from '../../shared/ngrx/city/city.reducers';
import * as fromCommon from '../../shared/ngrx/common/common.reducers';
import * as myCampaignActions from '../../shared/ngrx/my-campaign/my-campaign.actions';
import * as commonActions from '../../shared/ngrx/common/common.actions';
import * as cityActions from '../../shared/ngrx/city/city.actions';
import * as countryActions from '../../shared/ngrx/country/country.actions';

@Component({
  selector: 'app-my-campaign-container',
  template: `
    <app-my-wallet [wallet]="wallet$ | async"
                   [isLoading]="walletIsLoading$ | async"
                   (withdraw)="onWithdraw()"></app-my-wallet>
    <app-my-campaign *loading="isLoading$ |async"
                     [countries]="countries$ | async"
                     [cities]="citiesByCountries$ | async"
                     [myCities]="myCities$ | async"
                     [query]="query$ | async"
                     [page]="page$ | async"
                     [isLoading]="isLoading$ | async"
                     [total]="total$ | async"
                     [dynamicCities]="dynamicCities$ | async"
                     [dynamic]="dynamicCountries$ | async"
                     (invest)="onInvest($event)"
                     (queryChange)="onQueryChange($event)"
                     (pageChange)="onPageChange($event)"
    ></app-my-campaign>`
})
export class MyCampaignContainerComponent implements AfterViewInit {
  readonly countries$ = this.store.select(fromCountries.selectEntities);
  readonly citiesByCountries$ = this.store.select(fromCountries.citiesByCountriesEntities);
  readonly myCities$ = this.store.select(fromCountries.filteredListForPage);
  readonly isLoading$ = this.store.select(fromMyCampaign.isLoading);
  readonly query$ = this.store.select(fromMyCampaign.query);
  readonly page$ = this.store.select(fromMyCampaign.page);
  readonly total$ = this.store.select(fromCountries.filteredListCountriesTotal);
  readonly dynamicCountries$ = this.store.select(fromCountries.getDynamicInfoEntities);
  readonly dynamicCities$ = this.store.select(fromCities.getDynamicInfoEntities);
  readonly wallet$ = this.store.select(fromCommon.getWallet);
  readonly walletIsLoading$ = this.store.select(fromCommon.walletIsLoading);

  constructor(private store: Store<State>, private cd: ChangeDetectorRef) {
    this.store.dispatch(new countryActions.LoadDynamicCountryInformationRequest());
    this.store.dispatch(new cityActions.LoadDynamicCityInformationRequest());
    this.store.dispatch(new countryActions.LoadCountriesRequest());
    this.store.dispatch(new cityActions.LoadCityInformationRequest());
    this.store.dispatch(new myCampaignActions.LoadMyCitiesRequest());
    this.store.dispatch(new commonActions.LoadWalletDataRequest());
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public onQueryChange(query: string) {
    this.store.dispatch(new myCampaignActions.FilterUpdate({query, page: 1}));
  }

  public onPageChange(page: number) {
    this.store.dispatch(new myCampaignActions.FilterUpdate({page}));
  }

  public onWithdraw() {
    this.store.dispatch(new commonActions.WithdrawRequest());
  }

  public onInvest(data: { city: City, price: number | string }) {
    this.store.dispatch(new cityActions.Invest({
      id: data.city.id.toString(),
      price: data.price
    }));
  }
}
