import { Component, Input } from '@angular/core';
import { City } from '../../shared/models/city.model';

@Component({
  selector: 'app-my-city',
  template: `
    <div class="row">
      <h4 class="col-xs-12 col-md-4">{{ city.name }}</h4>
      <div class="col-xs-12 col-md-8">{{ city.population | convert }} ({{ 'CITY.CARD.PERCENTAGE' | translate:percentage}})</div>
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
