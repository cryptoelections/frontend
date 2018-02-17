import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Country} from '../../shared/models/country.model';
import {City} from '../../shared/models/city.model';
import {CountrySortOption} from './country-filter.component';

@Component({
  selector: 'app-country-list',
  templateUrl: 'country-list.component.html'
})
export class CountryListComponent {
  @Input() public cities: Array<City>;
  @Input() public citiesByCountries;
  @Input() public list: Array<Country>;
  @Input() public isLoading: boolean;
  @Input() public query: string;
  @Input() public total: number;
  @Input() public sortBy: CountrySortOption;
  @Input() public biggerFirst: boolean;
  @Input() public currentPage: number;
  @Input() public mostCostEffectiveCountries;
  @Input() public myCities;
  @Input() public dynamicCities;
  @Input() public dynamicCountries;
  @Output() public sortByChange = new EventEmitter<CountrySortOption>();
  @Output() public queryChange = new EventEmitter<string>();
  @Output() public queueChange = new EventEmitter<boolean>();
  @Output() public pageChange = new EventEmitter<number>();

  public numberOfCities(country: Country): number {
    return this.citiesByCountries[country.code].length;
  }

  public price(country: Country): number {
    const half = this.electorate(country) / 2;
    let price = 0;
    let electorate = this.myElectorate(country);
    if (country.active !== 0) {
      this.citiesByCountries[country.code]
        .filter((city: City) => {
          return this.myCities && !this.myCities[country.code]
            || !this.myCities[country.code].find(c => c.id === city.id);
        })
        .sort((a: City, b: City) => {
          const pricePerElectorate = (city: City) => (this.dynamicCities[city.id] && +this.dynamicCities[city.id].price) / +city.population;
          return pricePerElectorate(a) < pricePerElectorate(b) ? -1 : 1;
        })
        .forEach((city: City) => {
          while (electorate < half) {
            price += this.dynamicCities[city.id] && +this.dynamicCities[city.id].price;
            electorate += +city.population;
          }
        });
    }
    return price;
  }

  public electorate(country: Country): number {
    let count = 0;
    this.citiesByCountries[country.code].forEach((city: City) => count += +city.population);
    return count;
  }

  public myElectorate(country: Country): number {
    let count = 0;
    if (this.myCities && this.myCities[country.code] && this.myCities[country.code].length) {
      this.myCities[country.code].forEach((city: City) => count += +city.population);
    }
    return count;
  }
}
