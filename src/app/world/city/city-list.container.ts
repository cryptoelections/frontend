import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../shared/ngrx/index';
import { CitySortOption } from './city-filter.component';
import * as fromCities from '../../shared/ngrx/city/city.reducers';
import * as fromCountries from '../../shared/ngrx/country/country.reducers';
import * as cityActions from '../../shared/ngrx/city/city.actions';
import * as countryActions from '../../shared/ngrx/country/country.actions';

@Component({
  selector: 'app-city-list-container',
  template: `
    <app-city-list [list]="cities$ | async"
                   [countries]="countries$ | async"
                   [currentPage]="currentPage$ | async"
                   [total]="citiesTotal$ | async"
                   [query]="query$ | async"
                   [sortBy]="sortBy$ | async"
                   (sortByChange)="onSortByChange($event)"
                   (queueChange)="onQueueChange($event)"
                   (queryChange)="onQueryChange($event)"
                   (pageChange)="onPageChange($event)"></app-city-list>`
})
export class CityListContainerComponent implements AfterViewInit {
  readonly countries$ = this.store.select(fromCountries.selectEntities);
  readonly cities$ = this.store.select(fromCountries.citiesForPage);
  readonly currentPage$ = this.store.select(fromCities.page);
  readonly citiesTotal$ = this.store.select(fromCountries.filteredCitiesLength);
  readonly query$ = this.store.select(fromCities.query);
  readonly sortBy$ = this.store.select(fromCities.sortBy);

  constructor(private store: Store<State>,
              private cd: ChangeDetectorRef) {
    this.store.dispatch(new cityActions.LoadCitiesRequest());
    this.store.dispatch(new countryActions.LoadCountriesRequest());

  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public onSortByChange(sortBy: CitySortOption) {
    this.store.dispatch(new cityActions.FilterUpdate({ sortBy }));
  }

  public onQueryChange(query: string) {
    this.store.dispatch(new cityActions.FilterUpdate({ query }));
  }

  public onQueueChange(biggerFirst: boolean) {
    this.store.dispatch(new cityActions.FilterUpdate({ biggerFirst }));
  }

  public onPageChange(page: number) {
    this.store.dispatch(new cityActions.FilterUpdate({ page }));
  }
}
