import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Country} from '../../shared/models/country.model';
import {City} from '../../shared/models/city.model';
import {Web3Service} from '../../shared/services/web3.service';
import {DEFAULT_PRICE} from '../../shared/services/base.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-my-country',
  templateUrl: 'my-country.component.html',
})
export class MyCountryComponent implements OnChanges, AfterViewInit {
  @Input() public country: Country;
  @Input() public citiesOfCountry: Array<City>;
  @Input() public allCitiesByCountry: Array<City>;
  @Input() public dynamicCountries;
  @Input() public dynamicCities;
  @Input() public costEffectiveCities;
  @Output() public invest = new EventEmitter();

  public get imageLink() {
    return `assets/images/country-flags/large/${this.country && this.country.code.toLowerCase()}.png`;
  }

  public get isYours() {
    return this.dynamicCountries && this.dynamicCountries[this.country.id]
      && this.dynamicCountries[this.country.id].president === this.web3Service.coinbase || this.percentageByCountry() >= 50;
  }

  public get defaultPrice() {
    return DEFAULT_PRICE;
  }

  constructor(private web3Service: Web3Service,
              private router: Router,
              private cd: ChangeDetectorRef) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.allCitiesByCountry) {
      this.getCostEffectiveCities();
    }
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public cityElectorate(city: City) {
    return (+city.population * 100 / +this.electorate()).toFixed(2);
  }

  public tryToInvest(city: City) {
    if (this.web3Service.isLoggedIn) {
      this.invest.emit({
        city,
        price: this.dynamicCities && this.dynamicCities[city.id] && this.dynamicCities[city.id].price || DEFAULT_PRICE
      });
    } else {
      this.router.navigate(['/metamask']);
    }
  }

  public isYoursCity(city: City) {
    return !!this.citiesOfCountry.find(myCity => city.id === myCity.id);
  }

  public electorate(): number {
    let count = 0;
    if (this.allCitiesByCountry) {
      this.allCitiesByCountry.forEach((city: City) => count += +city.population);
    }
    return count;
  }

  public percentageByCountry() {
    let sum = 0;
    this.citiesOfCountry.forEach((city: City) => {
      sum += +this.percentage(city).percentage;
    });
    return sum;
  }

  public percentage(city: City): { percentage: string } {
    let count = 0;
    let percentage = '0';
    if (this.allCitiesByCountry && this.allCitiesByCountry.length) {
      this.allCitiesByCountry.forEach((c: City) => count += +c.population);
      if (count !== 0) {
        percentage = (100 * +(city && city.population) / count).toFixed(2);
      }
    }

    return {percentage};
  }

  public getCostEffectiveCities() {
    this.costEffectiveCities = this.allCitiesByCountry ? this.allCitiesByCountry
      .sort((a: City, b: City) => {
        const pricePerElectorate = (city: City) => {
          return (+(this.dynamicCities[city.id] && this.dynamicCities[city.id].price) || +DEFAULT_PRICE) / (+city.population || 1);
        };
        return pricePerElectorate(a) < pricePerElectorate(b) ? -1 : 1;
      }) : [];
  }

  public price(): number {
    let price = 0;
    let electorate = this.percentageByCountry();
    const half = this.electorate() / 2;
    this.allCitiesByCountry
      .filter((city) => !this.citiesOfCountry.find(c => c.id === city.id))
      .sort((a: City, b: City) => {
        const pricePerElectorate = (city: City) => {
          return (+(this.dynamicCities[city.id] && this.dynamicCities[city.id].price) || +DEFAULT_PRICE) / +city.population;
        };
        return pricePerElectorate(a) < pricePerElectorate(b) ? -1 : 1;
      })
      .forEach((city: City) => {
        while (electorate < half) {
          price += (this.dynamicCities[city.id] && +this.dynamicCities[city.id].price) || +DEFAULT_PRICE;
          electorate += +city.population;
        }
      });
    return price;
  }
}
