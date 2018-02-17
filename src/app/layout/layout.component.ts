import {Component} from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <app-header></app-header>

    <div class="container content-wrap">
      <router-outlet></router-outlet>
    </div>
    <app-footer></app-footer>
  `
})
export class LayoutComponent {

}
