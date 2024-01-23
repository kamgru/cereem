import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

export interface IContact {
    id: number;
    name: string;
    company: string;
    email: string;
    phone: string;
}

export interface IListContactsResponse {
    items: IContact[];
    totalCount: number;
}

export class ListContactsRequest {
    public page: number = 1;
    public pageSize: number = 10;
    public search: string = '';
    public sortBy: string = 'name';
    public sortDesc: boolean = false;
}

@Injectable({
    providedIn: 'root'
})
export class ContactService {

    private contactsSubject: BehaviorSubject<IContact[]> = new BehaviorSubject<IContact[]>([]);
    public contacts$: Observable<IContact[]> = this.contactsSubject.asObservable();

    constructor(
        private http: HttpClient,
    ) {
    }

    public addContact(contact: IContact) : Observable<any>{
        return this.http.post(`${environment.apiUrl}/api/v1/contact`, contact);

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
}
