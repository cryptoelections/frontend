import { Component, EventEmitter, Output } from '@angular/core';

export enum CitySortOption {
  Price,
  Population,
  Country,
//  Popularity
}

@Component({
  selector: 'app-city-filter',
  templateUrl: 'city-filter.component.html'
})
export class CityFilterComponent {
  public sortBy: CitySortOption;
  public query: string;
  @Output() sortByChange = new EventEmitter<CitySortOption>();
  @Output() queryChange = new EventEmitter<string>();

  public citySortOptions = [{
    option: CitySortOption.Price,
    name: 'CITY.FILTER.SORT.PRICE'
  }, {
    option: CitySortOption.Population,
    name: 'CITY.FILTER.SORT.POPULATION'
  }, {
    option: CitySortOption.Country,
    name: 'CITY.FILTER.SORT.COUNTRY'
// },{
//   option: CitySortOption.Price,
//   name: 'CITY.FILTER.SORT.PRICE'
  }]
}
