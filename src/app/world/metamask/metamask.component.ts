import {Component} from '@angular/core';
import {Web3Service} from '../../shared/services/web3.service';
import {Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-metamask',
  templateUrl: './metamask.component.html',
  styleUrls: ['./metamask.component.css']
})
export class MetamaskComponent {
  constructor(private web3Service: Web3Service,
              private router: Router,
              private authService: AuthService) {
    setInterval(() => {
      if (this.authService.coinbase && !this.wrongNetwork) {
        this.router.navigate(['/my']);
      }
    }, 100);
  }

  public get noMetamask() {
    return this.authService.noMetamask;
  }

  public get wrongNetwork() {
    return this.web3Service.wrongNetwork;
  }

  public get metamaskIsLocked() {
    return this.authService.isLocked;
  }
}
