import {Component} from '@angular/core';
import {Web3Service} from '../../shared/services/web3.service';
import {TranslateService} from '@ngx-translate/core';
import {BsModalService} from 'ngx-bootstrap';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  public links = [
    {
      text: 'MENU.COUNTRIES',
      linkTo: '/countries'
    }, {
      text: 'MENU.CITIES',
      linkTo: '/cities'
    }, {
      text: 'MENU.MAP',
      linkTo: '/map'
    }, {
      text: 'MENU.MY_CAMPAIGN',
      linkTo: '/my',
    }
  ];

  public contacts = [{
    link: 'mailto:info@cryptoelections.com',
    icon: 'fas fa-envelope-square'
  }, {
    link: 'https://www.facebook.com/cryptoelections/',
    icon: 'fab fa-facebook'
  }, {
    link: 'https://discord.gg/cjVH54J',
    icon: 'fab fa-discord'
  }];

  constructor(private web3Service: Web3Service,
              private modalService: BsModalService,
              private translate: TranslateService,
              private activatedRoute: ActivatedRoute) {
  }
}
