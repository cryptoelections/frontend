import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Web3Service} from '../../shared/services/web3.service';
import {TranslateService} from '@ngx-translate/core';
import {BsModalService} from 'ngx-bootstrap';
import {CountryModalComponent} from '../../shared/components/country-modal.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements AfterViewInit {
  public messages = [];

  public links = [
    {
      text: 'MENU.COUNTRIES',
      linkTo: '/countries'
    }, {
      text: 'MENU.CITIES',
      linkTo: '/cities'
      // },{
      //   text: 'MENU.MAP',
      //   linkTo: 'map'
    }, {
      text: 'MENU.MY_CAMPAIGN',
      linkTo: '/my',
    }
  ];

  public get home(): boolean {
    return this.activatedRoute.snapshot.url[0] && this.activatedRoute.snapshot.url[0].path === 'home';
  }

  constructor(private web3Service: Web3Service,
              private modalService: BsModalService,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute) {
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      this.web3Service.CryptoElections.deployed()
        .then(instance => instance.assignCountryEvent()
          .watch((error, result) => {
            if (result) {
              console.log('common', result);
              this.messages.push({
                type: 'president',
                msg: {text: 'NOTIFICATIONS.PRESIDENT', params: {user: 'Putin (test)', country: 'Canada'}},
                timeout: 5000
              });
            }
          }));

      //   this.web3Service.CryptoElections.deployed()
      //     .then(instance => instance.assignCountryEvent(this.web3Service.coinbase)
      //       .watch((error, result) => {
      //         if (result) {
      //           console.log('result', result);
      //           this.modalService.show(CountryModalComponent);
      //         }
      //       }));
      //

      //   this.web3Service.allPresidentialEvents().watch((error, result) => {
      //
      //   });

      // this.web3Service.allPresidentialEvents().watch((err, res) => console.log('res', res));
      // console.log(this.web3Service.presidentialEvent());
      // console.log(this.web3Service.allPresidentialEvents());
    }, 10000);
  }
}
