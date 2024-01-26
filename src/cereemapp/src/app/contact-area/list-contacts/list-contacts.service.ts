import {Injectable, signal} from '@angular/core';
import {BehaviorSubject, debounceTime, distinctUntilChanged, merge, Observable, Subject, switchMap, tap} from "rxjs";
import {IListContactsResponse, ListContactsRequest} from "../contact.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ListContactsService {

    private _request = new ListContactsRequest();
    private _search$ = new Subject<string>();
    private _page$ = new BehaviorSubject<number>(this._request.page);
    private _sortBy$ = new Subject<string>();
    private _pageSize$ = new Subject<number>();

    public totalPages_$ = signal(10);
    public currentIndex_$ = signal(0);
    public pageSize_$ = signal(10);
    public page_$ = signal(1);
    public contacts$: Observable<IListContactsResponse>;

    constructor(
        private http: HttpClient,
    ) {
        const search$ = this._search$.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(s => {
                this.currentIndex_$.set(0);
                this._request.search = s;
                this._request.page = 1;
                this.page_$.set(1);
                return this.listContacts(this._request);
            }));

        const page$ = this._page$.pipe(
            distinctUntilChanged(),
            switchMap(p => {
                this._request.page = p;
                this.page_$.set(p);
                return this.listContacts(this._request);
            }));

        const sortBy$ = this._sortBy$.pipe(
            distinctUntilChanged(),
            switchMap(s => {
                this._request.sortBy = s;
                this._request.page = 1;
                this.page_$.set(1);
                return this.listContacts(this._request);
            }));

        const pageSize$ = this._pageSize$.pipe(
            distinctUntilChanged(),
            switchMap(s => {
                this.currentIndex_$.set(0);
                this._request.pageSize = s;
                this._request.page = 1;
                this.pageSize_$.set(s);
                this.page_$.set(1);
                return this.listContacts(this._request);
            }));

        this.contacts$ = merge(page$, search$, sortBy$, pageSize$)
            .pipe(
                tap(x => {
                    this.totalPages_$.set(Math.ceil(x.totalCount / this._request.pageSize));
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
        this._pageSize$.next(pageSize);
    }

    tryNextPage(): boolean {
        if (this._request.page >= this.totalPages_$()) {
            return false;
        }
        this._request.page++;
        this._page$.next(this._page$.getValue() + 1);
        return true;
    }

    tryPrevPage(): boolean {
        if (this._request.page <= 1) {
            return false;
        }
        this._request.page--;
        this._page$.next(this._page$.getValue() - 1);
        return true;
    }

    sortBy(value: string) {
        this._sortBy$.next(value);
    }

    search(value: string) {
        this._search$.next(value);
    }
}
