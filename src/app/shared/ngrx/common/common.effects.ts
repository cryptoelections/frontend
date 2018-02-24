import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {Web3Service} from '../../services/web3.service';
import {BsModalService} from 'ngx-bootstrap';


import * as commonActions from './common.actions';
@Injectable()
export class CommonEffects {
  constructor(private actions$: Actions,
              private web3Service: Web3Service,
              private modalService: BsModalService) {
  }
}
