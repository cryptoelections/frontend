import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../../shared/ngrx/index';
import {CitySortOption} from './city-filter.component';
import {FilterService} from '../../shared/services/filter.service';
import {StorageKeys, StorageService} from '../../shared/services/storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {WithUnsubscribe} from '../../shared/mixins/with-unsubscribe';
import {City} from '../../shared/models/city.model';

import * as fromCities from '../../shared/ngrx/city/city.reducers';
import * as fromMyCampaign from '../../shared/ngrx/my-campaign/my-campaign.reducers';
import * as fromCountries from '../../shared/ngrx/country/country.reducers';
import * as cityActions from '../../shared/ngrx/city/city.actions';
import * as countryActions from '../../shared/ngrx/country/country.actions';
import * as debounce from 'lodash/debounce';
import * as myCampaignActions from '../../shared/ngrx/my-campaign/my-campaign.actions';
import * as nicknamesActions from '../../shared/ngrx/nicknames/nicknames.actions';
import * as fromNicknames from '../../shared/ngrx/nicknames/nicknames.reducers';

@Component({
  selector: 'app-city-list-container',
  template: `
    <app-city-list [list]="cities$ | async"
                   [countries]="countries$ | async"
                   [allCities]="allCities$ | async"
                   [currentPage]="currentPage$ | async"
                   [total]="citiesTotal$ | async"
                   [query]="query$ | async"
                   [sortBy]="sortBy$ | async"
                   [isLoading]="isLoading$ | async"
                   [nicknames]="nicknames$ | async"
                   [myCities]="myCities$ | async"
                   [dynamicCities]="dynamicInfoCities$ | async"
                   (sortByChange)="onSortByChange($event)"
                   (queueChange)="onQueueChange($event)"
                   (queryChange)="onQueryChange($event)"
                   (pageChange)="onPageChange($event)"
                   (invest)="invest($event)"></app-city-list>`
})
export class CityListContainerComponent extends WithUnsubscribe() implements OnInit, AfterViewInit {
  readonly countries$ = this.store.select(fromCountries.selectEntities);
  readonly allCities$ = this.store.select(fromCities.selectAll);
  readonly myCities$ = this.store.select(fromMyCampaign.selectAll);
  readonly cities$ = this.store.select(fromCountries.citiesForPage);
  readonly currentPage$ = this.store.select(fromCities.page);
  readonly citiesTotal$ = this.store.select(fromCountries.filteredCitiesLength);
  readonly filters$ = this.store.select(fromCities.filters);
  readonly query$ = this.store.select(fromCities.query);
  readonly sortBy$ = this.store.select(fromCities.sortBy);
  readonly isLoading$ = this.store.select(fromCities.isLoading);
  readonly dynamicInfoCities$ = this.store.select(fromCities.getDynamicInfoEntities);
  readonly nicknames$ = this.store.select(fromNicknames.selectEntities);

  private filterService = new FilterService({
    query: {type: 'string'},
    sortBy: {type: 'string', defaultOption: CitySortOption.Name.toString()},
    page: {type: 'string', defaultOption: '1'}
  }, this.router, this.storage, StorageKeys.CityFilter, this.activatedRoute);

  constructor(private store: Store<State>,
              private cd: ChangeDetectorRef,
              private router: Router,
              private storage: StorageService,
              private activatedRoute: ActivatedRoute) {
    super();
    this.onQueryChange = debounce(this.onQueryChange.bind(this), 500);
  }

  public ngOnInit() {
    this.store.dispatch(new cityActions.LoadCityInformationRequest());
    this.store.dispatch(new cityActions.LoadDynamicCityInformationRequest());
    this.store.dispatch(new countryActions.LoadCountriesRequest());
    this.store.dispatch(new nicknamesActions.LoadNicknamesRequest());
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

  public onSortByChange(sortBy: CitySortOption) {
    this.store.dispatch(new cityActions.FilterUpdate({sortBy}));
  }

  public onQueryChange(query: string) {
    this.store.dispatch(new cityActions.FilterUpdate({query, page: 1}));
  }

  public onQueueChange(biggerFirst: boolean) {
    this.store.dispatch(new cityActions.FilterUpdate({biggerFirst}));
  }

  public onPageChange(page: number) {
    this.store.dispatch(new cityActions.FilterUpdate({page}));
  }

  public invest(data: { city: City, price: number | string }) {
    this.store.dispatch(new cityActions.Invest({
      id: data.city.id.toString(),
      price: data.price
    }));
  }

  private initFilters() {
    const params = this.filterService.getParams();

    const query = params['query'];
    const sortBy = params['sortBy'];
    const page = params['page'];

    this.store.dispatch(new cityActions.FilterUpdate({query, sortBy, page}));
  }

}
