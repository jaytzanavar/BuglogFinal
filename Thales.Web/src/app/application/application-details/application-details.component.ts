import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Application } from '../application';
import { ApplicationService } from '../application.service';
import { LoaderService } from '../../shared/loader.service';
import { NotifyService } from '../../shared/notify.service';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.sass']
})
export class EditApplicationComponent implements OnInit {

  application: Application;

  constructor(
    private activeRoute: ActivatedRoute,
    private applicationService: ApplicationService,
    private notify: NotifyService,
    private loader: LoaderService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((param: Params) => {
      const id = param['id'];
      if (id) {
        this.get(id);
      } else {
        this.application = new Application();
      }
    });
  }

  get(id: string) {
    this.loader.show();
    this.applicationService.getApplication(id).subscribe(res => {
      this.application = res;
      this.loader.hide();
    }, error => {
      this.loader.hide();
      this.notify.error(error);
    });
  }

  update() {
    this.loader.show();
    this.applicationService.updateApplication(this.application).subscribe(res => {
      this.loader.hide();
      this.application = res;
      this.notify.success();
    }, error => {
      this.loader.hide();
      this.notify.error(error);
    });
  }

  delete() {
    this.loader.show();
    this.applicationService.deleteApplication(this.application.id).subscribe(res => {
      this.loader.hide();
      this.notify.info('Η εγγραφή διαγράφτηκε');
      this.router.navigate(['/applications']);
    }, error => {
      this.loader.hide();
      this.notify.error(error);
    });
  }

  insertOrUpdate() {
    this.application.id ? this.update() : this.insert();
  }

  insert() {
    this.loader.show();
    this.applicationService.insertApplication(this.application).subscribe(res => {
      this.loader.hide();
      this.location.go('application/' + res.id);
      this.application = res;
      this.notify.success();
    }, error => {
      this.loader.hide();
      this.notify.error(error);
    });
  }

}
