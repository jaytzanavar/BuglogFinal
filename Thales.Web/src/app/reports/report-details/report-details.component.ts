import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router , ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { ReportsService } from '../reports.service';
import { LoaderService } from '../../shared/loader.service';
import { NotifyService } from '../../shared/notify.service';

import introJs from '../../../../node_modules/intro.js/intro.js';

import { Report } from '../report';
import { ApplicationService } from '../../application/application.service';
import { Application } from '../../application/application';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.sass']
})
export class ReportDetailsComponent implements OnInit {
  filesUrl = `${environment.api}report/`;
  imageUrl = `${environment.api}report/`;
  report = new Report();
  applications = new Array<Application>();
  // Reactive Form Item
  reportForm: FormGroup;
  imageSrc: any;
  file: any;
  uploadFile: any;
  mylocation: any;


  formErrors = {
    'title': '',
    'summary': ''
  };
  validationMessages = {
    'title': {
      'required': 'O τίτλος είναι υποχρεωτικός',
      'maxlength': 'Το Όνομα πρέπει να είναι (50) χαρακτήρες!'
    },
    'summary': {
      'required': 'Η περίγραφη  έιναι υποχρεωτική.'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private loader: LoaderService,
    private notify: NotifyService,
    private reportService: ReportsService,
    private router: Router,
    private applicationService: ApplicationService,
    private location: Location
  ) {
    this.createForm();
  }

  private createForm() {
    this.reportForm = this.fb.group({
      title: [this.report.title, Validators.compose([
        Validators.required,
        Validators.maxLength(50)])
      ],
      summary: [this.report.summary, Validators.compose([Validators.required])],
      applicationId: [this.report.applicationId],
      reportType: [this.report.reportType],
      priority: [this.report.priority],
      url: [this.report.url],
      notes: [this.report.notes]
    });
    this.reportForm.valueChanges.subscribe(value => (this.onValueChanged(value)));
    this.onValueChanged();
  }

  onValueChanged(value?: any) {
    if (!this.reportForm) { return; }
    const form = this.reportForm;
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
    const model = this.reportForm.value;
    this.report.title = model.title;
    this.report.summary = model.summary;
    this.report.reportType = model.reportType;
    this.report.priority = model.priority;
    this.report.applicationId = model.applicationId;
    this.report.url = model.url;
    this.report.notes = model.notes;
    this.report.id ? this.update() : this.insert();
  }
  ngOnInit() {
    this.getApplications();
    this.route.params.subscribe((param) => {
      const id = param['id'];
     if (id === 'demo') {
        this.startTour();
      } else if (id !== 'new') {
        this.getReport(id);
      }
    });
  }

  getApplications() {
    this.loader.show();
    this.applicationService.getApplications().subscribe(res => {
      this.applications = res;
      this.loader.hide();
    }, error => {
      this.loader.hide();
      this.notify.error(error);
    });
  }

  update() {
    this.loader.show();
    this.reportService.updateReport(this.report).subscribe(res => {
      if (this.file) {
        this.reportService.makeFileRequest(`${this.filesUrl}image/application/${res.id}`, this.file).subscribe(image => {
          this.report.imageId = image;
        });
      }
      this.report = res;
      this.notify.success();
      this.loader.hide();
    }, error => {
      this.loader.hide();
      this.notify.error(error);
    });
  }

  getReport(id: string) {
    this.loader.show();
    this.reportService.getReport(id).subscribe(res => {
      this.report = res;
      this.createForm();
      this.loader.hide();
    }, error => {
      this.loader.hide();
      this.notify.error(error);
    });
  }

  insert() {
    this.loader.show();
    this.reportService.insertReport(this.report).subscribe(res => {
      if (this.file) {
        this.reportService.makeFileRequest(`${this.filesUrl}image/application/${res.id}`, this.file).subscribe(image => {
          this.report.imageId = image;
        });
      }
      this.report = res;
      this.location.go('report/' + res.id);
      this.notify.success();
      this.loader.hide();
    }, error => {
      this.loader.hide();
      this.notify.error(error);
    });
  }

  fileChanged(e): void {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = evt => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
      this.imageSrc = reader;
    }
    this.file = e.target.files[0];
    this.uploadFile = e.target.value;
  }

  getApplicationName() {
    const app = this.applications.find(x => x.id === this.reportForm.value.applicationId);
    return app ? app.name : '';
  }

  onChange(event: any) {
    if (event.srcElement) {
      this.file = event.srcElement.files;
      this.uploadFile = event.srcElement.files[0].name;
    } else if (event.originalTarget) {
      this.file = event.originalTarget.files;
      this.uploadFile = event.originalTarget.files[0].name;
    }
  }

  delete() {
    this.loader.show();
    this.reportService.deleteReport(this.report.id).subscribe(res => {
      this.router.navigate(['/reports']);
      this.notify.success('Η διαγραφή ολοκληρώθηκε');
      this.loader.hide();
    }, error => {
      this.loader.hide();
      this.notify.error(error);
    });
  }


  startTour() {
    introJs().setOption('exitOnOverlayClick', 'false').setOptions({
      steps: [
        {
          intro: 'Καλως ήλθατε στην δημιουργία νέου αιτήματος!',
          position: 'left'

        }, {
          element: '#heading1',
          intro: 'Στο παρών πεδίο μας αναγράφεται ο τίτλος του προγράμματος που επιθυμούμε να στείλουμε αίτηση',
          position: 'right'
        }, {
          element: '#heading2',
          intro: 'Υποχρεωτικό πεδιό: Σε αυτο το πεδίο αναγράφουμε τον τίτλο του αιτήματος μας',
          position: 'right'
        }, {
          element: '#heading3',
          intro: 'Υποχρεωτικό πεδιό: Σε αυτο το πεδίο αναγράφουμε μια σύντομη περιγραφή του θέματος που επιθυμούμε να αναφέρουμε',
          position: 'right'
        },
        {
          element: '#heading4',
          intro: 'Σε αυτο το πεδίο αναγράφουμε κάποιο σχολιασμό ή λεπτομέριες που θέλουμε ο παραλήπτης να λάβει υπόψιν του',
          position: 'right'
        },
        {
          element: '#heading5',
          intro: ' Επιλέγουμε το είδος αίτηματος που θέλουμε να αιτηθούμε',
          position: 'right'
        },
        {
          element: '#heading6',
          intro: ' Επιλέγουμε την πρωτεραιότητα που θέλουμε να αποδόσουμε στο αίτημα μας',
          position: 'right'
        },
        {
          element: '#heading7',
          intro: ' Αντιγράφουμε το URL (διεύθυνση στον φυλλομετριτή μας) και την τοποθετούμε στο παραπάνω πεδίο',
          position: 'right'
        },
        {
          element: '#heading8',
          intro: ' Επιλεγουμε μία εικόνα στην οποία εμφανίζετε το περιεχόμενο για το οποίο αιτούμαστε ',
          position: 'right'
        },
        {
          element: '#heading9',
          intro: ' Υποβάλουμε το αίτημα μας ώστε η ομάδα του ΓΕΑ/ΚΜΗ να το επεξεργαστεί κατάλληα ',
          position: 'right'
        },
        {
          element: document.querySelectorAll('.heading')[2],
          intro: ' Επιστροφή στην κεντρική σελίδα',
          position: 'right'
        }
      ]
    }).start().onexit(() => {
      this.router.navigate(['home']);
    });
  }

}

