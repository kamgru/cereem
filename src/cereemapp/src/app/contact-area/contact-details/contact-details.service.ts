import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

export interface IContactDetails {
    name: string;
    email?: string;
    phone?: string;
    companyId: string;
    companyName: string;
}

@Injectable({
    providedIn: 'root'
})
export class ContactDetailsService {

    constructor(
        private http: HttpClient
    ) {
    }

    getContactDetails(contactId: string): Observable<IContactDetails> {
        return this.http.get<IContactDetails>(`${environment.apiUrl}/api/v1/contact/${contactId}`);
    }
}
