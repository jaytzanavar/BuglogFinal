import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Injectable({
    providedIn: 'root'
})
export class NotifyService {
    private readonly notifier: NotifierService;
    constructor(notifierService: NotifierService) { this.notifier = notifierService; }

    success(message: string = 'To αίτημα σας πραγματοποιήθηκε με επιτυχία!') {
        this.notifier.notify('success', message);
    }

    warning(message) {
        this.notifier.notify('warning', message);
    }

    error(message: string = 'To αίτημα απέτυχε.') {
        this.notifier.notify('error', message);
    }

    info(message) {
        this.notifier.notify('info', message);
    }

    message(message) {
        this.notifier.notify('default', message);
    }
}
