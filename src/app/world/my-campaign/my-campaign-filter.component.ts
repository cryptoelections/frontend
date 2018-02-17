import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-my-campaign-filter',
  template: `
    <div class="row">
      <div class="col-sm-4 col-xs-12 pl-0">
        <input class="form-control col-sm-6"
               type="text"
               name="search"
               [placeholder]="'COUNTRY.FILTER.SEARCH' | translate"
               [(ngModel)]="query"
               (ngModelChange)="queryChange.emit($event)">
      </div>
      <h2 class="col-sm-4 col-xs-12 text-center">{{ header | translate }}</h2>
      <div class="col-sm-4 col-xs-12"></div>
    </div>`
})
export class MyCampaignFilterComponent {
  public header = 'CAMPAIGN.TITLE';
  @Input() public query: string;
  @Output() public queryChange = new EventEmitter<string>();
}
