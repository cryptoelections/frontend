import {
  AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges,
  TemplateRef
} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Country} from '../../shared/models/country.model';
import {City} from '../../shared/models/city.model';
import {TranslateService} from '@ngx-translate/core';
import {Web3Service} from '../../shared/services/web3.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-country-card',
  templateUrl: 'country-card.component.html',
})
export class CountryCardComponent implements OnChanges, AfterViewInit {
  @Input() public country: Country;
  @Input() public cities: Array<City>;
  @Input() public costEffectiveCities;
  @Input() public price: number;
  @Input() public electorate: number;
  @Input() public myElectorate: number;
  @Input() public myCities = [];
  @Input() public dynamic;
  @Input() public cityDynamic;
  @Input() public numberOfCities: number;
  @Input() public nicknames;
  @Output() public invest = new EventEmitter<{ city: City, price: number | string }>();
  public sortedCities: Array<City>;

  public get imageLink(): string {
    return `assets/images/country-flags/large/${this.country.code.toLowerCase()}.png`;
  }

  public get president(): string {
    return this.dynamic && this.dynamic.president
      && (this.nicknames && this.nicknames[this.dynamic.president] || this.dynamic.president)
      || this.translate.instant('COUNTRY.CARD.NOT_ELECTED_YET');
  }

  public get isYours(): boolean {
    return this.dynamic && this.dynamic.president === this.auth.coinbase;
  }

  constructor(private auth: Web3Service,
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
    const lowestPrice = this.sortedCities[0] && this.cityDynamic[this.sortedCities[0].id]
      && this.cityDynamic[this.sortedCities[0].id] && this.cityDynamic[this.sortedCities[0].id].price;
    const highestPrice = this.sortedCities.length > 1 && this.cityDynamic[this.sortedCities[this.sortedCities.length - 1].id]
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
    if (this.auth.coinbase) {
      this.invest.emit({
        city,
        price: this.cityDynamic && this.cityDynamic[city.id] && this.cityDynamic[city.id].price
      });
    } else {
      this.router.navigate(['/metamask']);
    }
  }
}
