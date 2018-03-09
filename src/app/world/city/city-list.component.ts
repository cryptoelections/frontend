import {Component, EventEmitter, Input, Output} from '@angular/core';
import {City} from '../../shared/models/city.model';
import {CitySortOption} from './city-filter.component';
import {Country} from '../../shared/models/country.model';

@Component({
  selector: 'app-city-list',
  templateUrl: 'city-list.component.html'
})
export class CityListComponent {
  @Input() public countries: { [code: string]: Array<Country> };
  @Input() public allCities: Array<City>;
  @Input() public list: Array<City>;
  @Input() public myCities;
  @Input() public sortBy: CitySortOption;
  @Input() public query: string;
  @Input() public currentPage: number;
  @Input() public isLoading: boolean;
  @Input() public isDynamicLoading: boolean;
  @Input() public total: number;
  @Input() public nicknames;
  @Input() public dynamicCities: Array<Partial<City>>;
  @Output() public sortByChange = new EventEmitter<CitySortOption>();
  @Output() public queueChange = new EventEmitter<boolean>();
  @Output() public queryChange = new EventEmitter<string>();
  @Output() public pageChange = new EventEmitter<number>();
  @Output() public invest = new EventEmitter<{ city: City, price: number | string }>();

  public getElectoratePercentage(city): string {
    let count = 0;
    this.allCities
      .filter((c: City) => c.country === city.country)
      .forEach((c: City) => count += +c.population);
    const percentage = (
      (
        100 * +city.population
      ) / count
    ).toFixed(2);
    return percentage;
  }
}
