import { Component, OnInit } from '@angular/core';
import { User } from '../user';

import { UserService } from '../../user/user.service';
import { PaginationService } from '../../shared/pagination.service';
import { NotifyService } from '../../shared/notify.service';
import { LoaderService } from '../../shared/loader.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.sass']
})
export class UserListComponent implements OnInit {

  page = 1;
  pageSize = 15;
  order = 'priority';
  search = '';
  type = 4;
  priority = 4;
  activeUser = 0;
  userRole = -1;

  Users = new Array<User>();
  rows = new Array<User>();
  totalPages: number;
  pages: Array<number>;
  roleName: string;


  constructor(
    private reportService: UserService,
    private pagerService: PaginationService,
    private notify: NotifyService,
    private loader: LoaderService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getUsers(true);
  }

  getUsers(searching: boolean = false) {
    this.loader.show();
    this.reportService.getPagedUsers(this.page, this.pageSize, this.activeUser, this.userRole, this.search).subscribe(res => {
      this.loader.hide(500);
      this.rows = res.rows;
      this.page = searching ? 1 : this.page;
      this.totalPages = Math.ceil(res.totalRows / this.pageSize);
      this.pages = this.pagerService.getPages(this.totalPages, this.page);
      this.search = '';
    }, error => {
      this.loader.hide(500);
      this.notify.error(error);
    });
  }

  searchTitle(value) {
    this.search = value;
    this.getUsers(true);
  }

  setPage(p: number) {
    if (p === this.page) {
      return;
    }
    this.page = p;
    this.getUsers();
  }

  nextPage() {
    if (this.page === this.totalPages) {
      return;
    }
    this.page += 1;
    this.getUsers();
  }

  previousPage() {
    if (this.page === 1) {
      return;
    }
    this.page -= 1;
    this.getUsers();
  }

  firstPage() {
    if (this.page === 1) {
      return;
    }
    this.page = 1;
    this.getUsers();
  }

  lastPage() {
    if (this.page === this.totalPages) {
      return;
    }
    this.page = this.totalPages;
    this.getUsers();
  }


}
