import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {City} from '../../shared/models/city.model';

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
  @Output() public invest = new EventEmitter();

  public get myCountries() {
    return this.myCities && this.myCities.map((c: City) => c && c.country_id)
      .filter((elem, index, self) => index === self.indexOf(elem));
  }

  public get myCitiesByCountry() {
    return this.myCities && this.myCities.reduce((m, i) => (
      {
        ...m,
        [i && i.country_id]: (
          m[i && i.country_id] ? [...m[i && i.country_id], i] : [i]
        )
      }
    ), {});
  }

  constructor(private cd: ChangeDetectorRef) {
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
