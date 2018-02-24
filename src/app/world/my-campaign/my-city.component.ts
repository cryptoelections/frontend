import {AfterViewInit, ChangeDetectorRef, Component, Input} from '@angular/core';
import {City} from '../../shared/models/city.model';

@Component({
  selector: 'app-my-city',
  templateUrl: 'my-city.component.html'
})
export class MyCityComponent implements AfterViewInit {
  @Input() public city: City;
  @Input() public cities: Array<City>;
  @Input() public first: boolean;

  public get percentage(): { percentage: string } {
    let count = 0;
    if (this.cities) {
      this.cities.forEach((c: City) => count += +c.population);
    }
    const percentage = (100 * (+this.city.population / count)).toFixed(2);
    return {percentage};
  }

  constructor(private cd: ChangeDetectorRef) {
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
