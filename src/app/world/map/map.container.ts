import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../../shared/ngrx';

import * as fromCountries from '../../shared/ngrx/country/country.reducers';
import * as fromMyCampaign from '../../shared/ngrx/my-campaign/my-campaign.reducers';
import * as fromCities from '../../shared/ngrx/city/city.reducers';
import * as cityActions from '../../shared/ngrx/city/city.actions';
import * as nicknamesActions from '../../shared/ngrx/nicknames/nicknames.actions';
import * as myCampaignActions from '../../shared/ngrx/my-campaign/my-campaign.actions';
import * as countryActions from '../../shared/ngrx/country/country.actions';
import * as fromNicknames from '../../shared/ngrx/nicknames/nicknames.reducers';
import {City} from '../../shared/models/city.model';
import {CitySortOption} from '../city/city-filter.component';

@Component({
  selector: 'app-map-container',
  template: `
    <app-map [countriesForMap]="countriesForMap$ | async"
             [myCitiesByCountry]="myCitiesByCountry$ | async"
             (selectCountry)="onSelectCountry($event)"></app-map>

    <app-selected-country
      [selectedCountryId]="selectedCountryId$ | async"
      [list]="citiesOfSelectedCountry$ | async"
      [countries]="countries$ | async"
      [isLoading]="isLoading$ | async"
      [nicknames]="nicknames$ | async"
      [myCities]="myCities$ | async"
      [dynamicCities]="dynamicInfoCities$ | async"
      [selectedCountry]="selectedCountry$ | async"
      [dynamic]="(dynamicCountries$ | async)[(selectedCountry$ | async) && (selectedCountry$ | async).id]"
      (invest)="invest($event)"
      (sortByChange)="onSortByChange($event)"
    ></app-selected-country>`
})
export class MapContainerComponent implements AfterViewInit {
  readonly countriesForMap$ = this.store.select(fromCountries.countriesForMap);
  readonly countries$ = this.store.select(fromCountries.selectCountryEntities);
  readonly selectedCountryId$ = this.store.select(fromCountries.selectedCountryId);
  readonly citiesOfSelectedCountry$ = this.store.select(fromCountries.selectedCountryCities);
  readonly myCitiesByCountry$ = this.store.select(fromCountries.selectAllByCountries);
  readonly myCities$ = this.store.select(fromMyCampaign.selectAll);
  readonly isLoading$ = this.store.select(fromCities.isLoading);
  readonly dynamicInfoCities$ = this.store.select(fromCities.getDynamicInfoEntities);
  readonly selectedCountry$ = this.store.select(fromCountries.selectedCountry);
  readonly dynamicCountries$ = this.store.select(fromCountries.getDynamicInfoEntities);
  readonly nicknames$ = this.store.select(fromNicknames.selectEntities);

  constructor(private store: Store<State>, private cd: ChangeDetectorRef) {
    this.store.dispatch(new cityActions.LoadCityInformationRequest());
    this.store.dispatch(new cityActions.LoadDynamicCityInformationRequest());
    this.store.dispatch(new countryActions.LoadCountriesRequest());
    this.store.dispatch(new countryActions.LoadDynamicCountryInformationRequest());
    this.store.dispatch(new nicknamesActions.LoadNicknamesRequest());
    this.store.dispatch(new myCampaignActions.LoadMyCitiesRequest());
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public onSelectCountry(selectedCountry: string) {
    this.store.dispatch(new countryActions.SelectCountry(selectedCountry));
  }

  public invest(data: { city: City, price: number | string }) {
    this.store.dispatch(new cityActions.Invest({
      id: data.city.id.toString(),
      price: data.price
    }));
  }

  public onSortByChange(sortOption: CitySortOption) {
    this.store.dispatch(new countryActions.FilterSelectedCountryCities(sortOption));
  }
}
