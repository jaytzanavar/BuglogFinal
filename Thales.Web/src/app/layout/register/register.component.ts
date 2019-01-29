import { Component, OnInit } from '@angular/core';
import { User } from '../../user/user';
import { AuthService } from '../../auth/auth.service';
import { LoaderService } from '../../shared/loader.service';
import { NotifyService } from '../../shared/notify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  user = new User();
  showPassword = false;
  passwordCheck: string;

  constructor(
    private auth: AuthService,
    private loader: LoaderService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
  }

  registerUser() {
    this.loader.show();
    this.auth.register(this.user).subscribe(res => {
      this.loader.hide();
      this.notify.success('Η εγγραφή ολοκληρώθηκε');
    }, err => {
      this.loader.hide();
      this.notify.error(err);
    });
  }



}
