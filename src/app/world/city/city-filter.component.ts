import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FilterComponent} from '../../shared/components/filters/filter.component';

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
    name: 'CITY.FILTER.SORT.NAME'
  }, {
    option: CitySortOption.PriceDown,
    name: 'CITY.FILTER.SORT.PRICE_DOWN'
  }, {
    option: CitySortOption.PriceUp,
    name: 'CITY.FILTER.SORT.PRICE_UP'
  }, {
    option: CitySortOption.PricePerVoteDown,
    name: 'CITY.FILTER.SORT.PRICE_PER_VOTE_DOWN'
  }, {
    option: CitySortOption.PricePerVoteUp,
    name: 'CITY.FILTER.SORT.PRICE_PER_VOTE_UP'
  }, {
    option: CitySortOption.ElectorateDown,
    name: 'CITY.FILTER.SORT.ELECTORATE_DOWN'
  }, {
    option: CitySortOption.ElectorateUp,
    name: 'CITY.FILTER.SORT.ELECTORATE_UP'
  }, {
    option: CitySortOption.Country,
    name: 'CITY.FILTER.SORT.COUNTRY'
// },{
//   option: CitySortOption.Price,
//   name: 'CITY.FILTER.SORT.PRICE'
  }];
}
