import { Application } from '../application/application';

export class Report {
    id: string;
    title: string;
    summary: string;
    notes: string;
    url: string;
    submitDate: Date;
    updated: Date;
    isRead: boolean;
    completed: Date;
    reportType: ReportType = 0;
    priority: Priority = 0;
    imageId: string;
    applicationId: string;
    application: Application;
    OnwerId: string;
    owner: Onwer;
    constructor() {
        this.application = new Application();
    }

}

export class Onwer {
    name: string;
    lastname: string;
}

export enum Priority {
    Χαμηλό,
    Μεσαίο,
    Υψηλό,
    Επείγον,
    Όλα
}

export enum ReportType {
    Bug,
    Feature,
    Change,
    Support,
    All
}
