import {Injectable, signal} from '@angular/core';
import {BehaviorSubject, debounceTime, distinctUntilChanged, merge, Observable, Subject, switchMap, tap} from "rxjs";
import {IListContactsResponse, ListContactsRequest} from "../contact.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ListContactsService {

    public totalPages_$ = signal(10);
    public req = new ListContactsRequest();
    public totalPages = 1;
    public currentIndex = 0;
    public contacts$: Observable<IListContactsResponse>;
    public search$ = new Subject<string>();
    public page$ = new BehaviorSubject<number>(this.req.page);
    public sortBy$ = new Subject<string>();
    public pageSize$ = new Subject<number>();

    constructor(
        private http: HttpClient,
    ) {
        const search$ = this.search$.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(s => {
                this.currentIndex = 0;
                this.req.search = s;
                this.req.page = 1;
                return this.listContacts(this.req);
            }));

        const page$ = this.page$.pipe(
            distinctUntilChanged(),
            switchMap(p => {
                this.req.page = p;
                return this.listContacts(this.req);
            }));

        const sortBy$ = this.sortBy$.pipe(
            distinctUntilChanged(),
            switchMap(s => {
                this.req.sortBy = s;
                this.req.page = 1;
                return this.listContacts(this.req);
            }));

        const pageSize$ = this.pageSize$.pipe(
            distinctUntilChanged(),
            switchMap(s => {
                this.currentIndex = 0;
                this.req.pageSize = s;
                this.req.page = 1;
                return this.listContacts(this.req);
            }));

        this.contacts$ = merge(page$, search$, sortBy$, pageSize$)
            .pipe(
                tap(x => {
                    this.totalPages_$.set(Math.ceil(x.totalCount / this.req.pageSize));
                    this.totalPages = Math.ceil(x.totalCount / this.req.pageSize);
                }));
    }

    public listContacts(req: ListContactsRequest): Observable<IListContactsResponse> {
        return this.http.get<IListContactsResponse>(`${environment.apiUrl}/api/v1/contact`, {
            params: {
                page: req.page.toString(),
                pageSize: req.pageSize.toString(),
                search: req.search,
                sortBy: req.sortBy,
                sortDesc: req.sortDesc.toString(),
            }
        });
    }

    changePageSize(value: number) {
        const pageSize = Math.min(Math.max(value, 10), 100);
        this.pageSize$.next(pageSize);
    }

    tryNextPage(): boolean {
        if (this.req.page >= this.totalPages) {
            return false;
        }
        this.req.page++;
        this.page$.next(this.page$.getValue() + 1);
        return true;
    }

    tryPrevPage(): boolean {
        if (this.req.page <= 1) {
            return false;
        }
        this.req.page--;
        this.page$.next(this.page$.getValue() - 1);
        return true;
    }

    sortBy(value: string) {
        this.sortBy$.next(value);
    }
}
