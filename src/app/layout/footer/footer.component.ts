import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Web3Service} from '../../shared/services/web3.service';
import {TranslateService} from '@ngx-translate/core';
import {BsModalService} from 'ngx-bootstrap';
import {CountryModalComponent} from '../../shared/components/country-modal.component';
import {ActivatedRoute} from '@angular/router';
import {CountryModalContainerComponent} from '../../shared/components/country-modal.container';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements AfterViewInit {
  @Input() public countries;
  @Input() public nicknames;

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
                msg: {
                  text: 'NOTIFICATIONS.PRESIDENT', params: {
                    user: this.nicknames && this.nicknames[result.args.address],
                    country: this.countries && this.countries[parseInt(result.args.countryId)]
                  }
                },
                timeout: 5000
              });
            }
          }));

      this.web3Service.CryptoElections.deployed()
        .then(instance => instance.assignCountryEvent(this.web3Service.coinbase)
          .watch((error, result) => {
            if (result) {
              const initialState = {
                countryId: parseInt(result.args.countryId)
              };
              this.modalService.show(CountryModalContainerComponent, {class: 'modal-lg', initialState});
            }
          }));
    }, 10000);
  }
}
