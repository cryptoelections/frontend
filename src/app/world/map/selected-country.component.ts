import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Country} from '../../shared/models/country.model';
import {City} from '../../shared/models/city.model';
import {CitySortOption} from '../city/city-filter.component';
import {zeroAddress} from '../country/country-card.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-selected-country',
  templateUrl: './selected-country.component.html'
})
export class SelectedCountryComponent {
  @Input() public countries: { [code: string]: Array<Country> };
  @Input() public allCities: Array<City>;
  @Input() public list: Array<City>;
  @Input() public myCities;
  @Input() public sortBy: CitySortOption;
  @Input() public query: string;
  @Input() public currentPage: number;
  @Input() public isLoading: boolean;
  @Input() public total: number;
  @Input() public nicknames;
  @Input() public selectedCountryId: string;
  @Input() public selectedCountry: Country;
  @Input() public dynamicCities: Array<Partial<City>>;
  @Input() public dynamic: Country;
  @Output() public sortByChange = new EventEmitter<CitySortOption>();
  @Output() public queueChange = new EventEmitter<boolean>();
  @Output() public queryChange = new EventEmitter<string>();
  @Output() public pageChange = new EventEmitter<number>();
  @Output() public invest = new EventEmitter<{ city: City, price: number | string }>();


  public getElectoratePercentage(city): string {
    let percentage = '0';
    if (this.list) {
      const electorate = this.electorate;
      percentage = (100 * +city.population / electorate).toFixed(2);
    }
    return percentage;
  }

  public get electorate(): number {
    let count = 0;
    if (this.list) {
      this.list.forEach((c: City) => count += +c.population);
    }
    return count;
  }

}
