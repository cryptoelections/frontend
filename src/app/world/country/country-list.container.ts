import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {CountrySortOption} from './country-filter.component';
import {State} from '../../shared/ngrx/index';
import {WithUnsubscribe} from '../../shared/mixins/with-unsubscribe';
import {FilterService} from '../../shared/services/filter.service';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageKeys, StorageService} from '../../shared/services/storage.service';
import * as debounce from 'lodash/debounce';
import * as fromCities from '../../shared/ngrx/city/city.reducers';
import * as fromCountries from '../../shared/ngrx/country/country.reducers';
import * as countryActions from '../../shared/ngrx/country/country.actions';
import * as cityActions from '../../shared/ngrx/city/city.actions';
import * as myCampaignActions from '../../shared/ngrx/my-campaign/my-campaign.actions';
import * as fromMyCampaign from '../../shared/ngrx/my-campaign/my-campaign.reducers';

@Component({
  selector: 'app-country-list-container',
  template: `
    <app-country-list
      [list]="countries$ | async"
      [cities]="cities$ | async"
      [mostCostEffectiveCountries]="costEffectiveCities$ | async"
      [currentPage]="page$ | async"
      [total]="total$ | async"
      [query]="query$ | async"
      [isLoading]="isLoading$ | async"
      [sortBy]="sortBy$ | async"
      [dynamicCities]="dynamicInfoCities$ | async"
      [citiesByCountries]="citiesByCountries$ | async"
      [myCities]="myCitiesByCountries$ | async"
      [dynamicCountries]="dynamicCountries$ | async"
      (sortByChange)="onSortByChange($event)"
      (queryChange)="onQueryChange($event)"
      (queueChange)="onQueueChange($event)"
      (pageChange)="onPageChange($event)"
    ></app-country-list>`
})
export class CountryListContainerComponent extends WithUnsubscribe() implements OnInit, AfterViewInit {
  readonly countries$ = this.store.select(fromCountries.countriesForPage);
  readonly cities$ = this.store.select(fromCities.selectAll);
  readonly page$ = this.store.select(fromCountries.page);
  readonly total$ = this.store.select(fromCountries.filteredCountriesLength);
  readonly isLoading$ = this.store.select(fromCountries.isLoading);
  readonly query$ = this.store.select(fromCountries.query);
  readonly sortBy$ = this.store.select(fromCountries.sortBy);
  readonly filters$ = this.store.select(fromCountries.filters);
  readonly citiesByCountries$ = this.store.select(fromCities.citiesByCountriesEntities);
  readonly costEffectiveCities$ = this.store.select(fromCountries.selectMostCostEffectiveCitiesForCountry);
  readonly dynamicInfoCities$ = this.store.select(fromCities.getDynamicInfoEntities);
  readonly myCitiesByCountries$ = this.store.select(fromMyCampaign.selectAllByCountries);
  readonly dynamicCountries$ = this.store.select(fromCountries.getDynamicInfoEntities);

  private filterService = new FilterService({
    query: {type: 'string'},
    sortBy: {type: 'string', defaultOption: CountrySortOption.Availability.toString()},
    page: {type: 'string', defaultOption: '1'}
  }, this.router, this.storage, StorageKeys.CountryFilter, this.activatedRoute);

  constructor(private store: Store<State>,
              private cd: ChangeDetectorRef,
              private router: Router,
              private storage: StorageService,
              private activatedRoute: ActivatedRoute) {
    super();
    this.onQueryChange = debounce(this.onQueryChange.bind(this), 500);
  }

  public ngOnInit() {
    this.store.dispatch(new cityActions.LoadDynamicCityInformationRequest());
    this.store.dispatch(new countryActions.LoadDynamicCountryInformationRequest());
    this.store.dispatch(new countryActions.LoadCountriesRequest());
    this.store.dispatch(new cityActions.LoadCityInformationRequest());
    this.store.dispatch(new myCampaignActions.LoadMyCitiesRequest());

    this.initFilters();
    this.filters$
      .takeUntil(this.unsubscribe$)
      .subscribe(filters => {
        this.filterService.update({
          sortBy: filters.sortBy,
          query: filters.query,
          page: filters.page
        });
      });
  }


  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public onSortByChange(sortBy: CountrySortOption) {
    this.store.dispatch(new countryActions.FilterUpdate({sortBy}));
  }

  public onQueryChange(query: string) {
    this.store.dispatch(new countryActions.FilterUpdate({query, page: 1}));
  }

  public onQueueChange(biggerFirst: boolean) {
    this.store.dispatch(new countryActions.FilterUpdate({biggerFirst}));
  }

  public onPageChange(page: number) {
    this.store.dispatch(new countryActions.FilterUpdate({page}));
  }

  private initFilters() {
    const params = this.filterService.getParams();

    const query = params['query'];
    const sortBy = params['sortBy'];
    const page = params['page'];

    this.store.dispatch(new countryActions.FilterUpdate({query, sortBy, page}));
  }
}
