import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  public links = [{
    text: 'MENU.COUNTRIES',
    linkTo: 'countries'
  },{
    text: 'MENU.CITIES',
    linkTo: 'cities'
  },{
    text: 'MENU.MAP',
    linkTo: 'map'
  },{
    text: 'MENU.MY_CITIES',
    linkTo: 'my'
  }]

  constructor(public auth: AuthService) {
  }

}
