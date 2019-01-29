import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { NotifyService } from '../../shared/notify.service';
import { LoaderService } from '../../shared/loader.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscriptions = new Array<Subscription>();
  username: string;
  password: string;

  isValid = true;

  constructor(
    private auth: AuthService,
    private router: Router,
    private notify: NotifyService,
    private loader: LoaderService
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.auth.loggedIn$.subscribe((login) => {
      if (login) {
        this.router.navigate(['/home']);
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  login() {
    this.loader.show();
    this.auth.login(this.username, this.password).subscribe(res => {
      if (res) {
        this.username = null;
        this.password = null;
      }
      this.loader.hide();
    }, error => {
      this.notify.error(error);
      this.loader.hide();
    });
  }

}
