import {Component} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'app-city-modal',
  template: `
    <div class="modal-body city-modal">
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <i aria-hidden="true" class="fas fa-times"></i>
      </button>
      <div class="container">
        <div class="modal-container p-3">
          <div class="city-modal-content p-5">
            <h2 [innerHTML]="'CITY.MODAL.CONGRATULATIONS' | translate:params"></h2>
            <button class="btn card-button mt-5" [routerLink]="['/my']" (click)="bsModalRef.hide()">
              {{ 'CITY.MODAL.RULE_CITY' | translate }}
            </button>
          </div>
        </div>
        <div class="modal-image-container">
          <img src="/assets/images/president-full.png" alt="">
        </div>
      </div>
    </div>
  `
})

export class CityModalComponent {
  public params = {};

  constructor(public bsModalRef: BsModalRef) {
  }
}
