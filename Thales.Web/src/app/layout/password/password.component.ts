import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.sass']
})
export class PasswordComponent implements OnInit {
  showPassword = false;
  passwordCheck: string;
  usernameValidate: string;
  emailIsValid = false;

  ngOnInit(): void {

  }




  // || (this.user.username = 'admin@kmh.gea.gr'))\
  constructor(
    private auth: AuthService
  ) { }
  retrivePassword() {
    console.log(this.usernameValidate);
    this.auth.validate(this.usernameValidate).subscribe(res => {
      console.log(res);
    }, err => {
      console.log(err);
    });
  }


  }
