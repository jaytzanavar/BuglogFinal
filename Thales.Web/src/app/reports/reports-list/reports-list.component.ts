import { Component, OnInit } from '@angular/core';

import { ReportsService } from '../reports.service';
import { LoaderService } from '../../shared/loader.service';
import { NotifyService } from '../../shared/notify.service';
import { Report, ReportType } from '../report';
import { PaginationService } from '../../shared/pagination.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.sass']
})
export class ReportsListComponent implements OnInit {
  totalRows: number;
  reportState: string;
  page = 1;
  pageSize = 5;
  order = 'priority';
  search = '';
  type = 4;
  priority = 4;
  pages: Array<number>;
  totalPages: number;
  rows = new Array<Report>();
  constructor(
    private reportService: ReportsService,
    private pagerService: PaginationService,
    private notify: NotifyService,
    private loader: LoaderService
  ) { }

  ngOnInit() {
    this.getReports();
  }

  searchTitle(value) {
    this.search = value;
    this.getReports(true);
  }
  getReports(searching: boolean = false) {
    this.loader.show();
    this.reportService.getPagedReports(this.page, this.pageSize, this.priority, this.type, this.order, this.search).subscribe(res => {
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

  getType(t: number) {
    return ReportType[t];
  }

  setPage(p: number) {
    if (p === this.page) {
      return;
    }
    this.page = p;
    this.getReports();
  }

  nextPage() {
    if (this.page === this.totalPages) {
      return;
    }
    this.page += 1;
    this.getReports();
  }

  previousPage() {
    if (this.page === 1) {
      return;
    }
    this.page -= 1;
    this.getReports();
  }

  firstPage() {
    if (this.page === 1) {
      return;
    }
    this.page = 1;
    this.getReports();
  }

  lastPage() {
    if (this.page === this.totalPages) {
      return;
    }
    this.page = this.totalPages;
    this.getReports();
  }

  orderBy(order: string) {
    this.order = order;
    this.getReports();
  }




}
