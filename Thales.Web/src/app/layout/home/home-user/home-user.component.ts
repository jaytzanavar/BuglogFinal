import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.sass']
})
export class HomeUserComponent implements OnInit {

  constructor( private authService: AuthService ) {
  }

  ngOnInit() {
    console.log( 'Home user: ', this.authService.user );
  }

}
