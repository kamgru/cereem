import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AsyncPipe} from "@angular/common";
import {ListContactsService} from "./list-contacts.service";
import {IContact} from "../contact.service";

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

    @ViewChild('searchInput')
    searchInput?: ElementRef<HTMLInputElement>;

    @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (this.listContacts.tryHandleKey(event)) {
            return;
        }

        if (event.ctrlKey && event.key == '/') {
            this.searchInput?.nativeElement.focus();
            event.preventDefault();
        } else if (event.key == 'Escape') {
            this.searchInput?.nativeElement.blur();
        }
    }

    public totalPages_$ = this.listContacts.totalPages_$;
    public currentIndex_$ = this.listContacts.currentIndex_$;
    public pageSize_$ = this.listContacts.pageSize_$;
    public page_$ = this.listContacts.page_$;
    public contacts$ = this.listContacts.contacts$;

    constructor(
        private listContacts: ListContactsService,
        private router: Router
    ) {
        const subscription = this.listContacts.selectedContact$
            .subscribe(contact => {
                this.router.navigate([`contacts/details/${contact.contactId}`])
                    .then(_ => {
                        subscription.unsubscribe();
                    });
            })
    }

    public changePageSize = (value: number) => this.listContacts.changePageSize(value);
    public tryNextPage = () => this.listContacts.tryNextPage();
    public tryPrevPage = () => this.listContacts.tryPrevPage();
    public sortBy = (value: string) => this.listContacts.sortBy(value);
    public search = (value: string) => this.listContacts.search(value);

    handleRowClick(index: number, contact: IContact) {
        this.currentIndex_$.set(index);
        this.router.navigate([`contacts/details/${contact.contactId}`])
            .then(_ => {
            });
    }
}
