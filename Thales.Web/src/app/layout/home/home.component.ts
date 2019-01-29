import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { HomeUserComponent } from './home-user/home-user.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

    userRole;

    constructor(authService: AuthService) {
        const data = authService.jwt.decodeToken( authService.getToken() );
        this.userRole = data.Role;
    }

    ngOnInit() {
    }

}
