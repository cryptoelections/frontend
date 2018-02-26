import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Country} from '../../shared/models/country.model';
import {City} from '../../shared/models/city.model';
import {TranslateService} from '@ngx-translate/core';
import {Web3Service} from '../../shared/services/web3.service';
import {Router} from '@angular/router';
import {DEFAULT_PRICE} from '../../shared/services/base.service';
import {AuthService} from '../../shared/services/auth.service';

const zeroAddress = '0x0000000000000000000000000000000000000000';

@Component({
  selector: 'app-country-card',
  templateUrl: 'country-card.component.html',
})
export class CountryCardComponent implements OnChanges, AfterViewInit {
  @Input() public country: Country;
  @Input() public cities: Array<City>;
  @Input() public myCities = [];
  @Input() public dynamic;
  @Input() public cityDynamic;

  public get numberOfCities(): number {
    return this.cities && this.cities.length;
  }

  @Input() public nicknames;
  @Output() public invest = new EventEmitter<{ city: City, price: number | string }>();
  public sortedCities: Array<City>;

  public get imageLink(): string {
    return `assets/images/country-flags/large/${this.country.code.toLowerCase()}.png`;
  }

  public get president(): string {
    if (this.dynamic && this.dynamic.president && this.dynamic.president !== zeroAddress) {
      return this.nicknames && this.nicknames[this.dynamic.president] || this.dynamic.president;
    } else {
      return this.translate.instant('COUNTRY.CARD.NOT_ELECTED_YET');
    }
  }

  public get isYours(): boolean {
    return this.dynamic && !!this.web3Service.coinbase
      && this.dynamic.president === this.web3Service.coinbase || this.myElectorate > 50;
  }

  public get defaultPrice() {
    return DEFAULT_PRICE;
  }


  public get price(): number {
    const half = this.electorate / 2;
    let price = 0;
    let electorate = this.myElectorate;
    if (this.country.active !== 0 && this.cities) {
      this.cities
        .filter((city: City) => {
          return this.myCities && !this.myCities
            || !this.myCities.find(c => c.id === city.id);
        })
        .sort((a: City, b: City) => {
          const pricePerElectorate = (city: City) =>
            (this.cityDynamic && this.cityDynamic[city.id] && +this.cityDynamic[city.id].price || DEFAULT_PRICE) / +city.population;
          return pricePerElectorate(a) < pricePerElectorate(b) ? -1 : 1;
        })
        .forEach((city: City) => {
          while (electorate < half) {
            price += this.cityDynamic && this.cityDynamic[city.id] && +this.cityDynamic[city.id].price || DEFAULT_PRICE;
            electorate += +city.population;
          }
        });
    }
    return price;
  }

  public get costEffectiveCities(): Array<City> {
    return this.cities
      .filter(city => !this.myCities.find(c => city.id === c.id))
      .sort((a: City, b: City) => {
        const pricePerElectorate = (city: City) =>
          (this.cityDynamic && this.cityDynamic[city.id] && +this.cityDynamic[city.id].price || DEFAULT_PRICE) / +city.population;
        return pricePerElectorate(a) < pricePerElectorate(b) ? -1 : 1;
      })
      .splice(0, 10);
  }

  public get electorate(): number {
    let count = 0;
    if (this.cities) {
      this.cities.forEach((city: City) => count += +city.population);
    }
    return count;
  }

  public get myElectorate(): number {
    let count = 0;
    if (this.myCities && this.myCities.length) {
      this.myCities.forEach((city: City) => count += +city.population);
    }
    return count;
  }

  constructor(private web3Service: Web3Service,
              private authService: AuthService,
              private translate: TranslateService,
              private cd: ChangeDetectorRef,
              private router: Router) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.cities) {
      this.sortedCities = this.cities
        ? this.cities.sort((a: City, b: City) => +a.price < +b.price ? -1 : 1)
        : [];
    }
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public cityPriceRange(): { lowestPrice: string, highestPrice: string } {
    const lowestPrice = this.sortedCities[0] && this.cityDynamic && this.cityDynamic[this.sortedCities[0].id]
      && this.cityDynamic[this.sortedCities[0].id] && this.cityDynamic[this.sortedCities[0].id].price;
    const highestPrice = this.sortedCities.length > 1 && this.cityDynamic
      && this.cityDynamic[this.sortedCities[this.sortedCities.length - 1].id]
      && this.cityDynamic[this.sortedCities[this.sortedCities.length - 1].id].price;
    return {lowestPrice, highestPrice};
  }

  public cityElectorate(city: City) {
    return (+city.population * 100 / +this.electorate).toFixed(2);
  }

  public isYoursCity(city: City) {
    return !!this.myCities.find(myCity => city.id === myCity.id);
  }

  public tryToInvest(city: City) {
    if (this.authService.coinbase && !this.web3Service.wrongNetwork) {
      this.invest.emit({
        city,
        price: this.cityDynamic && this.cityDynamic[city.id] && this.cityDynamic[city.id].price || DEFAULT_PRICE
      });
    } else {
      this.router.navigate(['/metamask']);
    }
  }
}
