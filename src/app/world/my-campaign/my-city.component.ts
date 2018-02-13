import { Component, Input } from '@angular/core';
import { City } from '../../shared/models/city.model';

@Component({
  selector: 'app-my-city',
  template: `
    <div class="row city">
      <div class="name col-xs-12 col-md-4"><h4>{{ city.name }}</h4></div>
      <div class="col-xs-12 col-md-8"><b>{{ city.population | convert }}</b> ({{ 'CITY.CARD.PERCENTAGE' | translate:percentage}})</div>
    </div>
  `
})
export class MyCityComponent {
  @Input() public city: City;
  @Input() public cities: Array<City>;

  public get percentage(): { percentage: string } {
    let count = 0;
    this.cities.forEach((c: City) => count += +c.population);
    const percentage = (
      (
        100 * +this.city.population
      ) / count
    ).toFixed(2);
    return { percentage };
  }


}
