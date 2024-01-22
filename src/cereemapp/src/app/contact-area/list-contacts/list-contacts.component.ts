import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {ContactService, IContact, IListContactsResponse, ListContactsRequest} from "../contact.service";
import {AsyncPipe} from "@angular/common";
import {Observable} from "rxjs";

@Component({
    selector: 'app-list-contacts',
    standalone: true,
    imports: [
        RouterLink,
        AsyncPipe
    ],
    templateUrl: './list-contacts.component.html',
    styleUrl: './list-contacts.component.css'
})
export class ListContactsComponent implements OnInit {

    private req: ListContactsRequest = new ListContactsRequest();

    public contacts$: Observable<IListContactsResponse> = this.contactService.listContacts(this.req);

    constructor(
        private contactService: ContactService,
    ) {
    }

    ngOnInit() {

    }
}
