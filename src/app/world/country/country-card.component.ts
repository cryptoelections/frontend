import { Component, Input, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
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
  @Input() public costEffectiveCities;
  @Input() public price: number;
  @Input() public electorate: number;
  @Input() public myCities = 0;
  @Input() public myElectorate = 0;
  @Input() public numberOfCities: number;
  public modalRef: BsModalRef;

  public get imageLink(): string {
    return `assets/images/country-flags/large/${this.country.code.toLowerCase()}.png`; // todo: add user images
  }

  public get president(): string {
    return this.translate.instant('COUNTRY.CARD.NOT_ELECTED_YET'); //todo get president's name
  }

  public get cityPriceRange(): string {
    let result;
    const lowestPrice = this.sortedCities[0] && this.sortedCities[0].price && (+this.sortedCities[0].price).toFixed(
      2);
    const highestPrice = this.sortedCities.length > 1 && this.sortedCities[this.sortedCities.length - 1] &&
      this.sortedCities[this.sortedCities.length - 1].price &&
      (+this.sortedCities[this.sortedCities.length - 1].price).toFixed(2);

    if (lowestPrice && highestPrice) {
      this.translate.get('COUNTRY.CARD.CITIES_PRICE_RANGE.CITIES', {
        lowestPrice,
        highestPrice
      }).subscribe(string => result = string);
    } else if (lowestPrice && !highestPrice) {
      this.translate.get(
        'COUNTRY.CARD.CITIES_PRICE_RANGE.ONE_CITY',
        { lowestPrice }
      )
        .subscribe(string => result = string);
    } else if (!lowestPrice && !highestPrice) {
      result = '';
    }

    return result;
  }

  public get sortedCities(): Array<City> {
    return this.cities[this.country.code]
      ? this.cities[this.country.code].sort((a: City, b: City) => +a.price < +b.price
        ? -1
        : 1)
      : [];
  }

  public get isYours(): boolean {
    // todo
    return true;
  }

  constructor(
    private translate: TranslateService,
    private modalService: BsModalService
  ) {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
