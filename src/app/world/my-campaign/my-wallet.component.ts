import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-my-wallet',
  template: `
    <div class="title"><h1 class="text-center"> {{ 'CAMPAIGN.TITLE' | translate }}</h1></div>

    <div class="wallet-wrap jumbotron text-center mb-4 mt-4">
      <div class="container">
        <p>{{ 'WALLET.TEXT' | translate }}</p>
        <div class="row" [ngClass]="{'pending': isLoading}">
          <div class="col-6 text-right">
            <h1 class="wallet">{{ wallet | eth:4 }} ETH</h1>
          </div>
          <div class="col-6 text-left">
            <button class="btn card-button" (click)="withdraw.emit()">{{ 'WALLET.WITHDRAW' | translate }}</button>
          </div>
        </div>
      </div>
    </div>`
})
export class MyWalletComponent {
  @Input() public wallet;
  @Input() public isLoading: boolean;
  @Output() public withdraw = new EventEmitter();
}
