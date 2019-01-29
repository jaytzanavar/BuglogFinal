import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';

import { UserService } from '../user.service';
import { LoaderService } from '../../shared/loader.service';
import { NotifyService } from '../../shared/notify.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.sass']
})
export class UserDetailsComponent implements OnInit {

  private assignStatus = false;
  private applications: [];
  user = new User();
  userForm: FormGroup;
  funkyPassword = 'balabunny';
  dropdownList = [
    { 'id': 1, 'itemName': 'India' },
    { 'id': 2, 'itemName': 'Singapore' },
    { 'id': 3, 'itemName': 'Australia' },
    { 'id': 4, 'itemName': 'Canada' },
    { 'id': 5, 'itemName': 'South Korea' },
    { 'id': 6, 'itemName': 'Germany' },
    { 'id': 7, 'itemName': 'France' },
    { 'id': 8, 'itemName': 'Russia' },
    { 'id': 9, 'itemName': 'Italy' },
    { 'id': 10, 'itemName': 'Sweden' }
  ];
  selectedItems = [
    { 'id': 2, 'itemName': 'Singapore' },
    { 'id': 3, 'itemName': 'Australia' },
    { 'id': 4, 'itemName': 'Canada' },
    { 'id': 5, 'itemName': 'South Korea' }
  ];
  dropdownSettings = {
    singleSelection: false,
    text: 'Assign applications',
    selectAllText: 'Add all',
    unSelectAllText: 'Remove all',
    enableSearchFilter: true,
    classes: ''
  };

  formErrors = {
    'name': '',
    'lastname': '',
    'username': ''
  };

  validationMessages = {
    'name': {
      'required': 'Το Όνομα είναι υποχρεωτικός',
      'maxlength': 'Το Όνομα έχει όριο (50) χαρακτήρων'
    },
    'lastname': {
      'required': 'Το Επίθετο έιναι υποχρεωτικό.',
      'maxlenght': 'To Eπίθετο έχει όριο (50) χαρακτήρων'
    },
    'username': {
      'required': 'Το username είναι υποχρεωτικό'
    },
    'password': {
      'required': 'Ο κωδικός είναι υποχρεωτικός'
    }
  };

  assignEvent() {
    this.assignStatus = !this.assignStatus;
  }

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private loader: LoaderService,
    private notify: NotifyService,
    private userService: UserService,
    private location: Location,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: [this.user.name, Validators.compose([
        Validators.required,
        Validators.maxLength(50)
      ])],
      lastname: [this.user.lastname, Validators.compose([
        Validators.required, Validators.maxLength(50)
      ])],
      username: [this.user.username, Validators.required],
      isActive: [this.user.isActive],
      role: [this.user.role],
      password: [this.user.password, Validators.required]
    });
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }



  ngOnInit() {
    this.route.params.subscribe((param) => {
      const id = param['id'];
      if (id !== 'new') {
        this.getUser(id);
        this.getUserApplication();
      } else if (id === 'new') {
        this.createForm();
      }
    });
  }

  getUserApplication() {
  }


  getUser(id: string) {
    this.loader.show();
    this.userService.getUser(id).subscribe(res => {
      this.user = res;
      this.createForm();
      this.loader.hide();
    }, error => {
      this.loader.hide();
      this.notify.error(error);
    });
  }

  createForm() {
    this.userForm = this.fb.group({
      name: [this.user.name, Validators.compose([
        Validators.required,
        Validators.maxLength(50)
      ])],
      lastname: [this.user.lastname, Validators.compose([
        Validators.required, Validators.maxLength(50)
      ])],
      username: [this.user.username, Validators.required],
      isActive: [this.user.isActive],
      role: [this.user.role],
      password: [this.user.password, this.user.id ? Validators.required : null]
    });
    this.userForm.valueChanges.subscribe(value => (this.onValueChanged(value)));
  }


  onValueChanged(value?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (field) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (value === 'submit') {
          control.markAsDirty();
        }
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (key) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSend() {
    const model = this.userForm.value;
    this.user.name = model.name;
    this.user.lastname = model.lastname;
    this.user.username = model.username;
    this.user.isActive = model.isActive;
    this.user.role = model.role;
    this.user.password = model.password;
    this.user.id ? this.update() : this.insert();

  }


  update() {
    this.loader.show();
    this.userService.updateUser(this.user).subscribe(res => {
      this.user = res;
      this.notify.success();
      this.loader.hide();
    }, error => {
      this.loader.hide();
      this.notify.error(error);
    });
  }

  insert() {
    this.loader.show();
    this.userService.insertUser(this.user).subscribe(res => {
      this.user = res;
      this.location.go('user/' + res.id);
      this.notify.success();
      this.loader.hide();
    }, error => {
      this.loader.hide();
      this.notify.error(error);
    });
  }


  delete() {
    this.loader.show();
    this.userService.deleteUser(this.user.id).subscribe(res => {
      this.router.navigate(['/user']);
      this.notify.success('Η διαγραφή ολοκληρώθηκε');
      this.loader.hide();
    }, error => {
      this.loader.hide();
      this.notify.error(error);
    });
  }

}
