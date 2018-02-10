import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterComponent } from '../../shared/components/filters/filter.component';
import { StorageKeys } from '../../shared/services/storage.service';

export enum CitySortOption {
  Name,
  PriceDown,
  PriceUp,
  ElectorateDown,
  ElectorateUp,
  PricePerVoteDown,
  PricePerVoteUp,
  Country,
//  Popularity
}

@Component({
  selector: 'app-city-filter',
  templateUrl: '../../shared/components/filters/filter.component.html',
  styleUrls: ['../../shared/components/filters/filter.component.css']
})
export class CityFilterComponent extends FilterComponent {
  @Input() public query: string;
  @Input() public sortBy: CitySortOption;
  @Output() public sortByChange = new EventEmitter<CitySortOption>();

  public header = 'CITY.TITLE';
  public sortOptions = [{
    option: CitySortOption.Name,
    name: 'CITY.FILTER.SORT.NAME',
    icon: ''
  }, {
    option: CitySortOption.PriceDown,
    name: 'CITY.FILTER.SORT.PRICE_DOWN',
    icon: 'icon-sort-alt-down'
  }, {
    option: CitySortOption.PriceUp,
    name: 'CITY.FILTER.SORT.PRICE_UP',
    icon: 'icon-sort-alt-up'
  }, {
    option: CitySortOption.PricePerVoteDown,
    name: 'CITY.FILTER.SORT.PRICE_PER_VOTE_DOWN',
    icon: 'icon-sort-alt-down'
  }, {
    option: CitySortOption.PricePerVoteUp,
    name: 'CITY.FILTER.SORT.PRICE_PER_VOTE_UP',
    icon: 'icon-sort-alt-up'
  }, {
    option: CitySortOption.ElectorateDown,
    name: 'CITY.FILTER.SORT.ELECTORATE_DOWN',
    icon: 'icon-sort-alt-down'
  }, {
    option: CitySortOption.ElectorateUp,
    name: 'CITY.FILTER.SORT.ELECTORATE_UP',
    icon: 'icon-sort-alt-up'
  }, {
    option: CitySortOption.Country,
    name: 'CITY.FILTER.SORT.COUNTRY',
    icon: ''
// },{
//   option: CitySortOption.Price,
//   name: 'CITY.FILTER.SORT.PRICE'
  }];
}
