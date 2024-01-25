import {
    Component,
    HostListener,
    OnInit
} from '@angular/core';

import {RouterLink} from "@angular/router";
import {
    ContactService,
    IListContactsResponse,
    ListContactsRequest
} from "../contact.service";

import {AsyncPipe} from "@angular/common";
import {
    BehaviorSubject,
    Observable,
    switchMap,
    tap,
    debounceTime,
    distinctUntilChanged,
    merge,
    Subject
} from "rxjs";
import {ListContactsService} from "./list-contacts.service";

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
export class ListContactsComponent {

    public req = new ListContactsRequest();

    @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event.key == 'ArrowDown') {
            this.currentIndex++;
            if (this.currentIndex > this.req.pageSize - 1) {
                if (this.tryNextPage()) {
                    this.currentIndex = 0;
                } else {
                    this.currentIndex = this.req.pageSize - 1;
                }
            }
        } else if (event.key == 'ArrowUp') {
            this.currentIndex--;
            if (this.currentIndex < 0) {
                if (this.req.page > 1) {
                    if (this.tryPrevPage()) {
                        this.currentIndex = this.req.pageSize - 1;
                    }
                } else {
                    this.currentIndex = 0;
                }
            }
        } else if (event.key == 'ArrowRight' || event.key == 'PageDown') {
            this.tryNextPage();
        } else if (event.key == 'ArrowLeft' || event.key == 'PageUp') {
            this.tryPrevPage();
        }
    }


    public totalPages = 0;
    public currentIndex = 0;
    public contacts$?: Observable<IListContactsResponse>;
    public search$ = new Subject<string>();

    constructor(
        private listContacts: ListContactsService
    ) {
        this.contacts$ = this.listContacts.contacts$.pipe(
            tap(_ => this.totalPages = this.listContacts.totalPages_$())
        );
    }

    public changePageSize = (value: number) => this.listContacts.changePageSize(value);
    public tryNextPage = () => this.listContacts.tryNextPage();
    public tryPrevPage = () => this.listContacts.tryPrevPage();
    public sortBy = (value: string) => this.listContacts.sortBy(value);

}
