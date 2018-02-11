import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Country } from '../../shared/models/country.model';
import { City } from '../../shared/models/city.model';
import { CountrySortOption } from './country-filter.component';
import { Dictionary } from '@ngrx/entity/src/models';

@Component({
  selector: 'app-country-list',
  templateUrl: 'country-list.component.html'
})
export class CountryListComponent {
  @Input() public cities: Array<City>;
  @Input() public citiesByCountries;
  @Input() public list: Array<Country>;
  @Input() public query: string;
  @Input() public total: number;
  @Input() public sortBy: CountrySortOption;
  @Input() public biggerFirst: boolean;
  @Input() public currentPage: number;
  @Output() public sortByChange = new EventEmitter<CountrySortOption>();
  @Output() public queryChange = new EventEmitter<string>();
  @Output() public queueChange = new EventEmitter<boolean>();
  @Output() public pageChange = new EventEmitter<number>();

  public numberOfCities(country: Country): number {
    return this.getCities(country).length;
  }


  public price(country: Country): { numberOfCities: number, price: number } {
    const half = this.electorate(country) / 2;
    let price = 0;
    let electorate = 0; // todo: add already bought cities electorate
    let numberOfCities = 0;
    this.getCities(country)
      .sort((a: City, b: City) => {
        const pricePerElectorate = (city: City) => city.price / +city.population;
        return pricePerElectorate(a) < pricePerElectorate(b) ? -1 : 1;
      })
      .forEach((city: City) => {
        while (electorate < half) {
          price += +city.price;
          numberOfCities++;
          electorate += +city.population;
        }
      });
    return { numberOfCities, price };
  }

  public electorate(country: Country): number {
    let count = 0;
    this.getCities(country).forEach((city: City) => count += +city.population)
    return count;
  }

  private getCities(country: Country): Array<City> {
    return this.cities && this.cities
      .filter((city: City) => city.country === country.code);
  }
}
