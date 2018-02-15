import { Component, Input } from '@angular/core';
import { City } from '../../shared/models/city.model';
import { AuthService } from '../../shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-city-card',
  templateUrl: 'city-card.component.html'
})
export class CityCardComponent {
  @Input() public city: City;
  @Input() public countries;
  @Input() public percent;
  public query: string;

  public get percentage() {
    return { percentage: this.percent };
  }

  public get status() {
    const population = +this.city.population;
    if (population < 200000) {
      return 'smallCity'
    } else if (population >= 200000 && population < 1000000) {
      return 'mediumCity'
    } else {
      return 'bigCity'
    }
  }

  public get countryName(): string {
    return this.countries && this.countries[this.city.country] && this.countries[this.city.country].name;
  }

  public get mayor(): string {
    // todo request city mayor's nickname
    return this.translate.instant('CITY.CARD.NOT_ELECTED_YET') ;
  }

  public get isYours() {
    // todo compare user's address with mayor's
    return true;
  }

  public get routerLink(): string {
    return `city/${this.city.country}-${this.city.name.trim()}`;
  }

  constructor(private authService: AuthService,
              private translate: TranslateService) {
  }

  public buyCity(city: City) {
    this.authService.buyCity(city.name, city.price);
  }
}
