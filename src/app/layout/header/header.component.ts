import {Component, ViewChild} from '@angular/core';
import {Web3Service} from '../../shared/services/web3.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  public nickname: string;
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

  @ViewChild('pop') public pop;

  constructor(public web3Service: Web3Service) {
  }

  public set() {
    this.web3Service.setNickname(this.nickname).then((error, result) => console.log(error, result));
    this.pop.hide();
  }
}
