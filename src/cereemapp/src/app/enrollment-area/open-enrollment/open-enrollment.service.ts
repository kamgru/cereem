import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

export class OpenEnrollmentRequest {
    name: string;
    deadline: string;

    constructor(name: string, deadline: string) {
        this.name = name;
        this.deadline = deadline;
    }
}

export interface IEnrollment {
    enrollmentId: string;
    name: string;
    deadline: Date;
    contacts: IEnrollmentContact[];
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
export class OpenEnrollmentService {

    constructor(
        private http: HttpClient
    ) {
    }

    openEnrollment(request: OpenEnrollmentRequest): Observable<string> {
        return this.http.post<string>(`${environment.apiUrl}/api/v1/enrollments/open`, request);
    }

    getEnrollment(enrollmentId: string): Observable<IEnrollment> {
        return this.http.get<IEnrollment>(`${environment.apiUrl}/api/v1/enrollments/${enrollmentId}`);
    }
}
