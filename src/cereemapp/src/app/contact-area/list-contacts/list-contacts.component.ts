import {Component, HostListener, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {ContactService, IContact, IListContactsResponse, ListContactsRequest} from "../contact.service";
import {AsyncPipe} from "@angular/common";
import {
    BehaviorSubject,
    debounce,
    delay,
    Observable,
    switchMap,
    tap,
    combineLatest,
    debounceTime,
    distinctUntilChanged, mergeAll, merge, Subject, filter, map
} from "rxjs";

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

    public req = new ListContactsRequest();

    private keypress$ = new Subject<KeyboardEvent>();

    @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event.key == 'ArrowDown'){
            this.currentIndex++;
            if (this.currentIndex > this.req.pageSize - 1) {
                this.currentIndex = 0;
                this.page$.next(this.page$.getValue() + 1);
            }
        } else if (event.key == 'ArrowUp') {
            this.currentIndex--;
            if (this.currentIndex < 0) {
                if (this.req.page > 1) {
                    this.currentIndex = this.req.pageSize - 1;
                    this.page$.next(this.page$.getValue() - 1);
                }else {
                    this.currentIndex = 0;
                }
            }
        } else if (event.key == 'ArrowRight'){
            this.page$.next(this.page$.getValue() + 1);
        } else if (event.key == 'ArrowLeft') {
            this.page$.next(this.page$.getValue() - 1);
        }
    }


    public currentIndex = 0;
    public contacts$?: Observable<IListContactsResponse>;
    public search$ = new Subject<string>();
    public page$ = new BehaviorSubject<number>(this.req.page);
    public sortBy$ = new Subject<string>();
    public pageSize$ = new Subject<number>();

    constructor(
        private contactService: ContactService,
    ) {

        const search$ = this.search$.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(s => {
                this.req.search = s;
                this.req.page = 1;
                return this.contactService.listContacts(this.req);
            }));

        const page$ = this.page$.pipe(
            distinctUntilChanged(),
            map(p => Math.min(Math.max(p, 1), 100)),
            switchMap(p => {
                this.req.page = p;
                return this.contactService.listContacts(this.req);
            }));

        const sortBy$ = this.sortBy$.pipe(
            distinctUntilChanged(),
            switchMap(s => {
                this.req.sortBy = s;
                this.req.page = 1;
                return this.contactService.listContacts(this.req);
            }));

        const pageSize$ = this.pageSize$.pipe(
            distinctUntilChanged(),
            switchMap(s => {
                this.currentIndex = 0;
                this.req.pageSize = s;
                this.req.page = 1;
                return this.contactService.listContacts(this.req);
            }));

        this.contacts$ = merge(page$, search$, sortBy$, pageSize$);
    }

    ngOnInit() {

    }

    ngOnAfterViewInit() {

    }
    onNextPage() {
        this.page$.next(this.page$.getValue() + 1);
    }

    sortBy(value: string) {
       this.sortBy$.next(value);
    }
}
