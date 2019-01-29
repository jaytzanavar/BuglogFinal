import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Application } from '../application';
import { ApplicationService } from '../../application/application.service';
import { PaginationService } from '../../shared/pagination.service';
import { NotifyService } from '../../shared/notify.service';
import { LoaderService } from '../../shared/loader.service';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.sass']
})
export class ListApplicationComponent implements OnInit {

  applications = new Array<Application>();

  constructor(
    private applicationService: ApplicationService,
    private pagerService: PaginationService,
    private notify: NotifyService,
    private loader: LoaderService
  ) { }

  ngOnInit() {
    this.getApplications();
  }

  getApplications() {
    this.loader.show();
    this.applicationService.getApplications().subscribe(res => {
      this.loader.hide();
      this.applications = res;
    }, error => {
      this.loader.hide();
      this.notify.error(error);
    });
  }

  delete(id: string) {
    this.loader.show();
    this.applicationService.deleteApplication(id).subscribe(res => {
      this.loader.hide();
      this.notify.info('Η εφαρμογή διαγράφτικε');
      const i = this.applications.findIndex(x => x.id === id);
      this.applications.splice(i, 1);
    }, error => {
      this.loader.hide();
      this.notify.error(error);
    });
  }

}
