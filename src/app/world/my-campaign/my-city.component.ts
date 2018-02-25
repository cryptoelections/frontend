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
  @Input() public percentage: number;

  constructor(private cd: ChangeDetectorRef) {
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
