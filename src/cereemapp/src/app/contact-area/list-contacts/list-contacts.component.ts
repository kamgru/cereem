import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AsyncPipe} from "@angular/common";
import {map, tap} from "rxjs";
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
    private _count = 0;

    @ViewChild('searchInput')
    searchInput?: ElementRef<HTMLInputElement>;

    @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event.ctrlKey && event.key == '/') {
            this.searchInput?.nativeElement.focus();
            event.preventDefault();
        } else if (event.key == 'Escape') {
            this.searchInput?.nativeElement.blur();
        } else if (event.key == 'ArrowDown') {
            this.currentIndex_$.set(this.currentIndex_$() + 1);
            if (this.currentIndex_$() > this._count - 1) {
                if (this.tryNextPage()) {
                    this.currentIndex_$.set(0);
                } else {
                    this.currentIndex_$.set(this._count - 1);
                }
            }
        } else if (event.key == 'ArrowUp') {
            this.currentIndex_$.set(this.currentIndex_$() - 1);
            if (this.currentIndex_$() < 0) {
                if (this.page_$() > 1) {
                    if (this.tryPrevPage()) {
                        this.currentIndex_$.set(this.pageSize_$() - 1);
                    }
                } else {
                    this.currentIndex_$.set(0);
                }
            }
        } else if (event.key == 'ArrowRight' || event.key == 'PageDown') {
            this.tryNextPage();
        } else if (event.key == 'ArrowLeft' || event.key == 'PageUp') {
            this.tryPrevPage();
        } else if (event.key == 'Enter') {
            const contact$ = this.contacts$.pipe(
                map(data => {
                    return data.items[this.currentIndex_$()];
                })
            )

            const subscription = contact$.subscribe(x => {
                this.router.navigate([`contacts/details/${x.contactId}`])
                    .then(_ => subscription.unsubscribe());
            })
        }
    }

    public totalPages_$ = this.listContacts.totalPages_$;
    public currentIndex_$ = this.listContacts.currentIndex_$;
    public pageSize_$ = this.listContacts.pageSize_$;
    public page_$ = this.listContacts.page_$;
    public contacts$ = this.listContacts.contacts$
        .pipe(tap(x => this._count = x.items.length));

    constructor(
        private listContacts: ListContactsService,
        private router: Router
    ) {
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
