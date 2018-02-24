import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../../shared/ngrx';
import {City} from '../../shared/models/city.model';

import * as fromMyCampaign from '../../shared/ngrx/my-campaign/my-campaign.reducers';
import * as fromCountries from '../../shared/ngrx/country/country.reducers';
import * as fromCities from '../../shared/ngrx/city/city.reducers';
import * as myCampaignActions from '../../shared/ngrx/my-campaign/my-campaign.actions';
import * as cityActions from '../../shared/ngrx/city/city.actions';
import * as countryActions from '../../shared/ngrx/country/country.actions';

@Component({
  selector: 'app-my-campaign-container',
  template: `
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
  readonly isLoading$ = this.store.select(fromMyCampaign.isLoading)
    .withLatestFrom(
      this.store.select(fromCities.isDynamicLoading),
      this.store.select(fromCities.isLoading),
      this.store.select(fromCountries.isLoading),
      this.store.select(fromCountries.isDynamicLoading))
    .map((loadings: boolean[]) => loadings.find(l => l === true));
  readonly query$ = this.store.select(fromMyCampaign.query);
  readonly page$ = this.store.select(fromMyCampaign.page);
  readonly total$ = this.store.select(fromCountries.filteredListCountriesTotal);
  readonly dynamicCountries$ = this.store.select(fromCountries.getDynamicInfoEntities);
  readonly dynamicCities$ = this.store.select(fromCities.getDynamicInfoEntities);

  constructor(private store: Store<State>, private cd: ChangeDetectorRef) {
    this.store.dispatch(new countryActions.LoadDynamicCountryInformationRequest());
    this.store.dispatch(new cityActions.LoadDynamicCityInformationRequest());
    this.store.dispatch(new countryActions.LoadCountriesRequest());
    this.store.dispatch(new cityActions.LoadCityInformationRequest());
    this.store.dispatch(new myCampaignActions.LoadMyCitiesRequest());
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

  public onInvest(data: { city: City, price: number | string }) {
    this.store.dispatch(new cityActions.Invest({
      id: data.city.id.toString(),
      price: data.price
    }));
  }
}
