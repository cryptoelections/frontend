import {AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Country} from '../../shared/models/country.model';
import {City} from '../../shared/models/city.model';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../shared/services/auth.service';

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
  public sortedCities: Array<City>;
  public modalRef: BsModalRef;

  public get imageLink(): string {
    return `assets/images/country-flags/large/${this.country.code.toLowerCase()}.png`;
  }

  public get president(): string {
    return this.dynamic && this.dynamic.president
      || this.translate.instant('COUNTRY.CARD.NOT_ELECTED_YET');
  }

  public get isYours(): boolean {
    return this.dynamic && this.dynamic.president === this.auth.coinbase;
  }

  constructor(private auth: AuthService,
              private translate: TranslateService,
              private modalService: BsModalService,
              private cd: ChangeDetectorRef) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.cities) {
      this.sortedCities = this.cities
        ? this.cities[this.country.code].sort((a: City, b: City) => +a.price < +b.price ? -1 : 1)
        : [];
    }
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }


  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  public cityPriceRange(): { lowestPrice: string, highestPrice: string } {
    const lowestPrice = this.sortedCities[0] && this.cityDynamic[this.sortedCities[0].id]
      && this.cityDynamic[this.sortedCities[0].id] && this.cityDynamic[this.sortedCities[0].id].price;
    const highestPrice = this.sortedCities.length > 1 && this.cityDynamic[this.sortedCities[this.sortedCities.length - 1].id]
      && this.cityDynamic[this.sortedCities[this.sortedCities.length - 1].id]
      && this.cityDynamic[this.sortedCities[this.sortedCities.length - 1].id].price;
    return {lowestPrice, highestPrice};
  }

}
