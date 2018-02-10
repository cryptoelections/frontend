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
  @Input() public cities: Array<City>;
  @Input() public sellParams: { numberOfCities: number, price: number };
  @Input() public electorate: number;
  @Input() public numberOfCities: number;

  public get imageLink(): string {
    return `https://flagpedia.net/data/flags/normal/${this.country.code.toLowerCase()}.png`; // todo: add user images
  }

  public get params() {
    return { numberOfCities: this.sellParams && this.sellParams.numberOfCities }
  }

  public get president(): string {
    return this.translate.instant('COUNTRY.CARD.NOT_ELECTED_YET'); //todo get president's name
  }

  public get citiesLength(): { numberOfCities: number } {
    return { numberOfCities: this.numberOfCities }
  }

  constructor(private translate: TranslateService) {
  }
}
