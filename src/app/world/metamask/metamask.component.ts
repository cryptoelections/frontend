import {Component} from '@angular/core';
import {Web3Service} from '../../shared/services/web3.service';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-metamask',
  templateUrl: './metamask.component.html',
  styleUrls: ['./metamask.component.css']
})
export class MetamaskComponent {
  constructor(private web3Service: Web3Service, private router: Router) {
    setTimeout(() => {
      if (this.web3Service.isLoggedIn) {
        this.router.navigate(['/my']);
      }
    }, 1000);
  }

  public get noMetamask() {
    return this.web3Service.noMetamask;
  }

  public get wrongNetwork() {
    return this.web3Service.wrongNetwork;
  }

  public get metamaskIsLocked() {
    return this.web3Service.isLocked;
  }
}
