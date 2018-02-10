import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CountrySortOption } from './country-filter.component';
import { State } from '../../shared/ngrx/index';

import * as fromCities from '../../shared/ngrx/city/city.reducers'
import * as fromCountries from '../../shared/ngrx/country/country.reducers'
import * as countryActions from '../../shared/ngrx/country/country.actions';
import * as cityActions from '../../shared/ngrx/city/city.actions';

@Component({
  selector: 'app-country-list-container',
  template: `
    <app-country-list [list]="countries$ | async"
                      [cities]="cities$ | async"
                      [currentPage]="page$ | async"
                      [total]="total$ | async"
                      [query]="query$ | async"
                      [sortBy]="sortBy$ | async"
                      (sortByChange)="onSortByChange($event)"
                      (queryChange)="onQueryChange($event)"
                      (queueChange)="onQueueChange($event)"
                      (pageChange)="onPageChange($event)"></app-country-list>`
})
export class CountryListContainerComponent implements AfterViewInit {
  readonly countries$ = this.store.select(fromCountries.countriesForPage);
  readonly cities$ = this.store.select(fromCities.selectAll);
  readonly page$ = this.store.select(fromCountries.page);
  readonly total$ = this.store.select(fromCountries.filteredCountriesLength);
  readonly query$ = this.store.select(fromCountries.query);
  readonly sortBy$ = this.store.select(fromCountries.sortBy);

  constructor(private store: Store<State>,
              private cd: ChangeDetectorRef) {
    this.store.dispatch(new countryActions.LoadCountriesRequest());
    this.store.dispatch(new cityActions.LoadCitiesRequest());
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public onSortByChange(sortBy: CountrySortOption) {
    this.store.dispatch(new countryActions.FilterUpdate({ sortBy }));
  }

  public onQueryChange(query: string) {
    this.store.dispatch(new countryActions.FilterUpdate({ query }));
  }

  public onQueueChange(biggerFirst: boolean) {
    this.store.dispatch(new countryActions.FilterUpdate({ biggerFirst }));
  }

  public onPageChange(page: number) {
    this.store.dispatch(new countryActions.FilterUpdate({ page }));
  }
}
