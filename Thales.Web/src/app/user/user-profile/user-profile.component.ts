import { Component, OnInit } from '@angular/core';
import { User, Profile, UserRole } from '../user';

import { UserService } from '../../user/user.service';
import { PaginationService } from '../../shared/pagination.service';
import { NotifyService } from '../../shared/notify.service';
import { LoaderService } from '../../shared/loader.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass']
})
export class UserProfileComponent implements OnInit {

  profile = new Profile();
  passwordError      = false;
  passwordErrorMsg   = '';
  passwordSuccess    = false;
  passwordSuccessMsg = '';

  private _oldPassword      = '';
  private _newPassword      = '';
  private _againNewPassword = '';

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private notify: NotifyService
    ) { }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.userService.getUserProfile().subscribe(res => {
      this.profile = res;
      this.profile.roleName = this.userService.getUserRoleNameById( this.profile.role );
      this.profile.totalReports = 5;
    }, error => {
      this.notify.error(error);
    });

  }

  setNewPassword() {
    this.passwordError = false;
    this.passwordSuccess = false;

    if ( !this._oldPassword || !this._newPassword || !this._againNewPassword ) {
      this.passwordError = true;
      this.passwordErrorMsg = 'Παρακαλώ συμπληρώστε ολα τα παιδια.';
    } else if ( this._newPassword !== this._againNewPassword ) {
      this.passwordError = true;
      this.passwordErrorMsg = 'Οι κωδικοί δεν ταιριάζουν.';
    } else if ( !this.validatePassword( this._newPassword ) ) {
      this.passwordError = true;
      this.passwordErrorMsg = 'Ο κωδικος σας πρεπει να περιεχει 4 χαρακτιρες 1 αριθμο 1 κεφαλαιο και ενα μικρο γραμμα.';
    } else if ( this._oldPassword ) {
      this.userService.updateUserPassword( this._newPassword ).subscribe(res => {
        this.passwordSuccess = true;
        this.passwordSuccessMsg = res;
      }, error => {
        this.notify.error(error);
      });
    }
  }

  validatePassword( password: string ): boolean {
    if ( password ) {
      return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{4,}$/.test(password);
    }
    return false;
  }

}
