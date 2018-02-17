import {Component} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-metamask',
  templateUrl: './metamask.component.html',
  styleUrls: ['./metamask.component.css']
})
export class MetamaskComponent {
  constructor(private auth: AuthService, private router: Router) {
    setTimeout(() => {
      if (this.auth.isLoggedIn) {
        this.router.navigate(['/my']);
      }
    }, 1000);
  }
}
