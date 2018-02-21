import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {City} from '../../shared/models/city.model';
import {DEFAULT_PRICE} from '../../shared/services/base.service';

@Component({
  selector: 'app-my-campaign',
  templateUrl: './my-campaign.component.html'
})
export class MyCampaignComponent implements AfterViewInit {
  @Input() public countries;
  @Input() public cities;
  @Input() public myCities: Array<City>;
  @Input() public query: string;
  @Input() public page: number;
  @Input() public total: number;
  @Input() public dynamic;
  @Input() public dynamicCities;
  @Input() public isLoading: boolean;
  @Output() public queryChange = new EventEmitter<string>();
  @Output() public pageChange = new EventEmitter<number>();

  public get myCountries() {
    return this.myCities && this.myCities.map((c: City) => c && c.country)
      .filter((elem, index, self) => index === self.indexOf(elem));
  }

  public get myCitiesByCountry() {
    return this.myCities && this.myCities.reduce((m, i) => (
      {
        ...m,
        [i && i.country]: (
          m[i && i.country] ? [...m[i && i.country], i] : [i]
        )
      }
    ), {});
  }

  constructor(private cd: ChangeDetectorRef) {
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }


  public electorate(country): number {
    let count = 0;
    if (this.myCitiesByCountry && this.myCitiesByCountry[country] && this.myCitiesByCountry[country].length) {
      this.myCitiesByCountry[country].forEach((city: City) => count += city && +city.population);
    }
    return count;
  }
}
