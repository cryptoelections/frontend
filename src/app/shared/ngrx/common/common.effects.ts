import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';

import * as commonActions from './common.actions';
import {Web3Service} from '../../services/web3.service';
import {BsModalService} from 'ngx-bootstrap';
import {CountryModalContainerComponent} from '../../components/country-modal.container';

@Injectable()
export class CommonEffects {
  constructor(private actions$: Actions,
              private web3Service: Web3Service,
              private modalService: BsModalService) {
    // this.subscribeForPresidentialEvents();
    // const initialState = {
    //   params: {name: 'Canada'},
    //   countryCode: 'CA'
    // };
    // this.modalService.show(CountryModalContainerComponent, {class: 'modal-lg', initialState});
  }

  public subscribeForPresidentialEvents() {
    this.web3Service.presidentialEvent().watch((error, result) => {
      if (result) {
        console.log(result);
        this.modalService.show(CountryModalContainerComponent, {class: 'modal-lg'});
      }
    });
  }
}
