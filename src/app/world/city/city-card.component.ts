import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {City} from '../../shared/models/city.model';
import {Web3Service} from '../../shared/services/web3.service';
import {TranslateService} from '@ngx-translate/core';
import {BASE_URL, DEFAULT_PRICE} from '../../shared/services/base.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-city-card',
  templateUrl: 'city-card.component.html'
})
export class CityCardComponent implements OnChanges {
  @Input() public city: City;
  @Input() public countries;
  @Input() public percent;
  @Input() public dynamic;
  @Input() public nicknames;
  @Output() public invest = new EventEmitter<{ city: City, price: number | string }>();
  public randomColor: string;
  public query: string;
  public isYours: boolean;

  public get percentage() {
    return {percentage: this.percent};
  }

  public get price() {
    return this.dynamic && this.dynamic.price || DEFAULT_PRICE;
  }

  public get cityImageSource(): string {
    return this.city.coat ? `${BASE_URL}/images/${this.city.coat}` : 'assets/images/CoA.png';
  }

  public get countryName(): string {
    return this.countries && this.countries[this.city.country] && this.countries[this.city.country].name;
  }

  public get firstLetters(): string {
    const words = this.city && this.city.name && this.city.name.split(' ');
    return words.splice(0, 3).map(word => word.charAt(0)).join('');
  }

  public get numberOfLetters(): number {
    const words = this.city && this.city.name && this.city.name.split(' ');
    return words.splice(0, 3).length;
  }

  constructor(private web3Service: Web3Service,
              private translate: TranslateService,
              private router: Router) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.city && !this.city.coat) {
      this.randomColor = `color-${Math.floor(Math.random() * 8)}`;
    }
  }

  public loadMayor() {
    const address = this.dynamic && this.dynamic.mayor;
    this.isYours = address === this.web3Service.coinbase && !!this.web3Service.coinbase;
    return this.dynamic && this.dynamic.mayor
      && (this.nicknames && this.nicknames[this.dynamic.mayor] || this.dynamic.mayor)
      || this.translate.instant('CITY.CARD.NOT_ELECTED_YET');
  }

  public tryToInvest() {
    if (this.web3Service.coinbase) {
      this.invest.emit({city: this.city, price: this.price});
    } else {
      this.router.navigate(['/metamask']);
    }
  }
}
