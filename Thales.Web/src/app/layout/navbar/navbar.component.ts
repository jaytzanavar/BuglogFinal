import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotifyService } from '../../shared/notify.service';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../user/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private subscriptions = new Array<Subscription>();
  user = new User();
  openMenu = false;
  loggedIn = false;

  constructor(
    private auth: AuthService,
    private notify: NotifyService
  ) { }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit() {
    this.subscriptions.push(this.auth.loggedIn$.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    }));
    this.subscriptions.push(this.auth.user$.subscribe((user) => {
      this.user = user;
    }));

    let scrollToggle = false;

    window.addEventListener('scroll', function() {
      const sctop  = this.document.getElementsByTagName('html')[0].scrollTop;
      const navbar = this.document.getElementsByClassName('navbar')[0];
      if ( sctop > 0 && !scrollToggle ) {
        scrollToggle = true;
        navbar.classList.add('scro');
      } else if (scrollToggle && sctop === 0) {
        scrollToggle = false;
        navbar.classList.remove('scro');
      }
    }, false);
  }

  logout() {
    this.auth.logout();
  }

}
