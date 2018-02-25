import {Component, Input} from '@angular/core';
import {Web3Service} from '../../shared/services/web3.service';
import {TranslateService} from '@ngx-translate/core';
import {BsModalService} from 'ngx-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {CountryModalContainerComponent} from '../../shared/components/country-modal.container';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  @Input() public countries;
  @Input() public nicknames;
  @Input() public messages;

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
    // setTimeout(() => {
    //   this.web3Service.presidentEvent.watch((error, result) => {
    //     const initialState = {
    //       countryId: parseInt(result.args.countryId)
    //     };
    //     this.modalService.show(CountryModalContainerComponent, {initialState});
    //   });
    // }, 15000);
  }
}
