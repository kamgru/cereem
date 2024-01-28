import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EnrollmentDetailsService, IGetEnrollmentDetailsResponse} from "./enrollment-details.service";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {ListContactsComponent} from "../../contact-area/list-contacts/list-contacts.component";
import {IContact} from "../../contact-area/contact.service";

enum UiState {
    View = 'view',
    ListContacts = 'list-contacts',
}

@Component({
    selector: 'app-enrollment-details',
    standalone: true,
    imports: [
        AsyncPipe,
        JsonPipe,
        ListContactsComponent
    ],
    templateUrl: './enrollment-details.component.html',
    styleUrl: './enrollment-details.component.css'
})
export class EnrollmentDetailsComponent implements OnInit {

    private _enrollmentId?: string;

    public uiState = UiState.View;
    public enrollment?: IGetEnrollmentDetailsResponse;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private enrollmentDetailsService: EnrollmentDetailsService
    ) {
    }

    ngOnInit() {
        this._enrollmentId = this.route.snapshot.params['id'];

        this.enrollmentDetailsService.getEnrollment(this._enrollmentId!)
            .subscribe((enrollment) => {
                this.enrollment = enrollment;
            });
    }

    addContact() {
        this.uiState = UiState.ListContacts;
    }

    protected readonly UiState = UiState;

    handleContactSelected($event: IContact) {
        if (this.enrollment?.contacts?.some(x => x.contactId == $event.contactId)) {
            this.uiState = UiState.View;
            return;
        }

        this.enrollmentDetailsService.enrollContact(this._enrollmentId!, $event.contactId)
            .subscribe(() => {
                this.enrollment?.contacts?.push({
                    contactId: $event.contactId,
                    name: $event.name,
                    email: $event.email,
                    phone: $event.phone,
                });
                this.uiState = UiState.View;
            });
    }
}
