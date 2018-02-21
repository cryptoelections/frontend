import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {Country} from '../../shared/models/country.model';
import {City} from '../../shared/models/city.model';
import {CountrySortOption} from './country-filter.component';

@Component({
  selector: 'app-country-list',
  templateUrl: 'country-list.component.html'
})
export class CountryListComponent implements AfterViewInit {
  @Input() public cities: Array<City>;
  @Input() public citiesByCountries: { [id: string]: Partial<Country> };
  @Input() public list: Array<Country>;
  @Input() public isLoading: boolean;
  @Input() public query: string;
  @Input() public total: number;
  @Input() public sortBy: CountrySortOption;
  @Input() public biggerFirst: boolean;
  @Input() public currentPage: number;
  @Input() public myCitiesByCountries: { [id: string]: Array<City> };
  @Input() public dynamicCities: { [id: string]: Partial<City> };
  @Input() public dynamicCountries: { [id: string]: Partial<Country> };
  @Input() public nicknames;
  @Output() public sortByChange = new EventEmitter<CountrySortOption>();
  @Output() public queryChange = new EventEmitter<string>();
  @Output() public queueChange = new EventEmitter<boolean>();
  @Output() public pageChange = new EventEmitter<number>();
  @Output() public invest = new EventEmitter<{ city: City, price: number | string }>();

  constructor(private cd: ChangeDetectorRef) {
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
