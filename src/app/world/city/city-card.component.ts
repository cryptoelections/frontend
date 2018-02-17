import {Component, EventEmitter, Input, Output} from '@angular/core';
import {City} from '../../shared/models/city.model';
import {AuthService} from '../../shared/services/auth.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-city-card',
  templateUrl: 'city-card.component.html'
})
export class CityCardComponent {
  @Input() public city: City;
  @Input() public countries;
  @Input() public percent;
  @Input() public dynamic;
  @Input() public nicknames;
  @Output() public invest = new EventEmitter<City>();
  public query: string;
  public isYours: boolean;

  public get percentage() {
    return {percentage: this.percent};
  }

  public get price() {
    return this.dynamic && this.dynamic.price;
  }

  public get status() {
    const population = +this.city.population;
    if (population < 200000) {
      return 'smallCity';
    } else if (population >= 200000 && population < 1000000) {
      return 'mediumCity';
    } else {
      return 'bigCity';
    }
  }

  public get countryName(): string {
    return this.countries && this.countries[this.city.country] && this.countries[this.city.country].name;
  }

  constructor(private authService: AuthService,
              private translate: TranslateService) {
  }

  public loadMayor() {
    const address = this.dynamic && this.dynamic.mayor;
    this.isYours = address === this.authService.coinbase;
    return this.dynamic && this.dynamic.mayor
      && (this.nicknames && this.nicknames[this.dynamic.mayor] || this.dynamic.mayor)
      || this.translate.instant('CITY.CARD.NOT_ELECTED_YET');
  }
}
