import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

export interface IGetEnrollmentDetailsResponse {
    name: string;
    deadline: string;
    state: string;
    contacts?: IEnrollmentContact[];
}

export interface IEnrollmentContact {
    contactId: string;
    name: string;
    email: string;
    phone: string;
}

@Injectable({
    providedIn: 'root'
})
export class EnrollmentDetailsService {

    constructor(
        private http: HttpClient
    ) {
    }

    getEnrollment(enrollmentId: string) : Observable<IGetEnrollmentDetailsResponse> {
        return this.http.get<IGetEnrollmentDetailsResponse>(`${environment.apiUrl}/api/v1/enrollments/${enrollmentId}`);
    }

    enrollContact(enrollmentId: string, contactId: string) : Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/api/v1/enrollments/${enrollmentId}/enroll`, {
            contactId: contactId
        });
    }
}
