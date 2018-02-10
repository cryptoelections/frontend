import { Component, EventEmitter, Input, Output } from '@angular/core';
import { City } from '../../shared/models/city.model';
import { CitySortOption } from './city-filter.component';

@Component({
  selector: 'app-city-list',
  templateUrl: 'city-list.component.html'
})
export class CityListComponent {
  @Input() public countries;
  @Input() public list: Array<City>;
  @Input() public sortBy: CitySortOption;
  @Input() public query: string;
  @Input() public currentPage: number;
  @Input() public total: number;
  @Output() public sortByChange = new EventEmitter<CitySortOption>();
  @Output() public queueChange = new EventEmitter<boolean>();
  @Output() public queryChange = new EventEmitter<string>();
  @Output() public pageChange = new EventEmitter<number>();

  public getElectoratePercentage(city): string {
    let count = 0;
    this.list
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
