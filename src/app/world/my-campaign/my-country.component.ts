import {Component, Input} from '@angular/core';
import {Country} from '../../shared/models/country.model';
import {City} from '../../shared/models/city.model';
import {Web3Service} from '../../shared/services/web3.service';

@Component({
  selector: 'app-my-country',
  templateUrl: 'my-country.component.html',
})
export class MyCountryComponent {
  private _percentage: number;

  @Input() public country: Country;
  @Input() public citiesOfCountry: Array<City>;
  @Input() public allCitiesByCountry;
  @Input() public dynamicCountries;
  @Input() public dynamicCities;

  @Input()
  public set percentage(value: number) {
    this._percentage = +value;
  }

  public get percentage(): number {
    return this._percentage;
  }

  @Input() public sellParams: { numberOfCities: number, price: number };

  public get params() {
    return {numberOfCities: this.sellParams && this.sellParams.numberOfCities};
  }

  public get isYours() {
    return this.dynamicCountries && this.dynamicCountries[this.country.id]
      && this.dynamicCountries[this.country.id].president === this.web3Service.coinbase;
  }

  constructor(private web3Service: Web3Service) {
  }
}
