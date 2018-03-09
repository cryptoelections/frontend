import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {City} from '../../shared/models/city.model';
import {TranslateService} from '@ngx-translate/core';
import {BASE_URL} from '../../shared/services/base.service';
import {Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';
import {Web3Service} from '../../shared/services/web3.service';
import {zeroAddress} from '../country/country-card.component';

@Component({
  selector: 'app-city-card',
  templateUrl: 'city-card.component.html'
})
export class CityCardComponent implements OnChanges {
  @Input() public city: City;
  @Input() public countries;
  @Input() public percent;
  @Input() public dynamic;
  @Input() public isLoading: boolean;
  @Input() public nicknames;
  @Input() public myCities;
  @Output() public invest = new EventEmitter<{ city: City, price: number | string }>();
  public randomColor: string;
  public query: string;
  public isYours: boolean;

  public get percentage() {
    return {percentage: this.percent};
  }

  public get price() {
    return this.dynamic && this.dynamic.price || this.city && this.city.startPrice;
  }

  public get cityImageSource(): string {
    return this.city.coat ? `${BASE_URL}/images/${this.city.coat}` : 'assets/images/CoA.png';
  }

  public get countryName(): string {
    return this.countries && this.countries[this.city.country_id] && this.countries[this.city.country_id].name;
  }

  public get firstLetters(): string {
    const words = this.city && this.city.name && this.city.name.split(' ');
    return words.splice(0, 3).map(word => word.charAt(0)).join('');
  }

  public get numberOfLetters(): number {
    const words = this.city && this.city.name && this.city.name.split(' ');
    return words.splice(0, 3).length;
  }

  constructor(private authService: AuthService,
              private web3Service: Web3Service,
              private translate: TranslateService,
              private router: Router) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.city && !this.city.coat) {
      this.randomColor = `color-${Math.floor(Math.random() * 8)}`;
    }
    if (changes.myCities) {
      this.isYours = this.myCities.indexOf(+this.city.id) > -1 && !!this.authService.coinbase;
    }
  }

  public loadMayor() {
    const address = this.dynamic && this.dynamic.mayor;
    return this.isYours ? (this.web3Service.accountNickname || this.authService.coinbase)
      : this.dynamic && this.dynamic.mayor && this.dynamic.mayor !== zeroAddress
      && (this.nicknames && this.nicknames[this.dynamic.mayor] || this.dynamic.mayor)
      || this.translate.instant('CITY.CARD.NOT_ELECTED_YET');
  }

  public tryToInvest() {
    if (this.authService.coinbase) {
      this.invest.emit({city: this.city, price: this.price});
    } else {
      this.router.navigate(['/metamask']);
    }
  }
}
