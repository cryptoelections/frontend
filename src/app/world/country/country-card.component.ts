import { Component, Input } from '@angular/core';
import { Country } from '../../shared/models/country.model';
import { City } from '../../shared/models/city.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-country-card',
  templateUrl: 'country-card.component.html',
})
export class CountryCardComponent {
  @Input() public country: Country;
  @Input() public cities;
  @Input() public sellParams: { numberOfCities: number, price: number };
  @Input() public electorate: number;
  @Input() public numberOfCities: number;

  public get imageLink(): string {
    return `assets/images/country-flags/large/${this.country.code.toLowerCase()}.png`; // todo: add user images
  }

  public get params() {
    return { numberOfCities: this.sellParams && this.sellParams.numberOfCities }
  }

  public get president(): string {
    return this.translate.instant('COUNTRY.CARD.NOT_ELECTED_YET'); //todo get president's name
  }

  public get cityPriceRange(): string {
    let result;
    const lowestPrice = this.sortedCities[0] && this.sortedCities[0].price && (+this.sortedCities[0].price).toFixed(2);
    const highestPrice = this.sortedCities.length > 1 && this.sortedCities[this.sortedCities.length - 1] &&
      this.sortedCities[this.sortedCities.length - 1].price &&
      (+this.sortedCities[this.sortedCities.length - 1].price).toFixed(2);

    if (lowestPrice && highestPrice) {
      this.translate.get('COUNTRY.CARD.CITIES_PRICE_RANGE.CITIES', {
        lowestPrice,
        highestPrice
      }).subscribe(string => result = string);
    } else if (lowestPrice && !highestPrice) {
      this.translate.get('COUNTRY.CARD.CITIES_PRICE_RANGE.ONE_CITY',
        { lowestPrice })
        .subscribe(string => result = string);
    } else if (!lowestPrice && !highestPrice) {
      result = '';
    }

    return result
  }

  public get citiesLength(): { numberOfCities: number } {
    return { numberOfCities: this.numberOfCities }
  }

  public get sortedCities(): Array<City> {
    return this.cities[this.country.code]
      ? this.cities[this.country.code].sort((a: City, b: City) => +a.price < +b.price ? -1 : 1)
      : [];
  }

  constructor(private translate: TranslateService) {
  }
}
