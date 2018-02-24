import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <app-header></app-header>
    <div class="container">
      <div *ngFor="let error of errors">
        <alert [type]="error.type" [dismissOnTimeout]="error.timeout"><span
          [innerHTML]="error.msg.text | translate:error.msg.params"></span></alert>
      </div>
    </div>
    <div class="container content-wrap">
      <router-outlet></router-outlet>
    </div>
    <app-footer-container></app-footer-container>
  `
})
export class LayoutComponent {
  @Input() public errors;
}
