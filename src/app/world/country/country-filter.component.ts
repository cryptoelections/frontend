import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterComponent } from '../../shared/components/filters/filter.component';

export enum CountrySortOption {
  Name,
  PriceDown,
  PriceUp,
  NumberOfCitiesDown,
  NumberOfCitiesUp,
  ElectorateDown,
  ElectorateUp,
  // Area
}

@Component({
  selector: 'app-country-filter',
  templateUrl: '../../shared/components/filters/filter.component.html',
  styleUrls: ['../../shared/components/filters/filter.component.css']
})
export class CountryFilterComponent extends FilterComponent {
  @Input() public sortBy: CountrySortOption;
  @Input() public query: string;
  @Output() public sortByChange = new EventEmitter<CountrySortOption>();

  public header = 'COUNTRY.TITLE';
  public sortOptions = [{
    option: CountrySortOption.Name,
    name: 'COUNTRY.FILTER.SORT.NAME'
  }, {
    option: CountrySortOption.PriceDown,
    name: 'COUNTRY.FILTER.SORT.PRICE_DOWN'
  }, {
    option: CountrySortOption.PriceUp,
    name: 'COUNTRY.FILTER.SORT.PRICE_UP'
  }, {
    option: CountrySortOption.NumberOfCitiesDown,
    name: 'COUNTRY.FILTER.SORT.NUMBER_OF_CITIES_DOWN'
  }, {
    option: CountrySortOption.NumberOfCitiesUp,
    name: 'COUNTRY.FILTER.SORT.NUMBER_OF_CITIES_UP'
  }, {
    option: CountrySortOption.ElectorateDown,
    name: 'COUNTRY.FILTER.SORT.ELECTORATE_DOWN'
  }, {
    option: CountrySortOption.ElectorateUp,
    name: 'COUNTRY.FILTER.SORT.ELECTORATE_UP'
    // },{
    //   option: CountrySortOption.Area,
    //   name: 'COUNTRY.FILTER.SORT.AREA'
  }];
}
