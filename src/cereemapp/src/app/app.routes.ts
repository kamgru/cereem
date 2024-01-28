import {Routes} from '@angular/router';
import {ContactAreaComponent} from "./contact-area/contact-area.component";
import {AddContactComponent} from "./contact-area/add-contact/add-contact.component";
import {ListContactsComponent} from "./contact-area/list-contacts/list-contacts.component";
import {ContactDetailsComponent} from "./contact-area/contact-details/contact-details.component";
import {OpenEnrollmentComponent} from "./enrollment-area/open-enrollment/open-enrollment.component";
import {ListEnrollmentsComponent} from "./enrollment-area/list-enrollments/list-enrollments.component";
import {EnrollmentAreaComponent} from "./enrollment-area/enrollment-area.component";
import {EnrollmentDetailsComponent} from "./enrollment-area/enrollment-details/enrollment-details.component";

export const contactAreaRoutes: Routes = [
    {
        path: 'add',
        component: AddContactComponent,
    },
    {
        path: 'list',
        component: ListContactsComponent,
    },
    {
        path: 'details/:id',
        component: ContactDetailsComponent
    },
];

export const enrollmentAreaRoutes: Routes = [
    {
        path: 'list',
        component: ListEnrollmentsComponent,
    },
    {
        path: 'open-enrollment',
        component: OpenEnrollmentComponent
    },
    {
        path: 'details/:id',
        component: EnrollmentDetailsComponent
    },
];
export const routes: Routes = [
    {
        path: 'contacts',
        component: ContactAreaComponent,
        children: contactAreaRoutes,
    },
    {
        path: 'enrollments',
        component: EnrollmentAreaComponent,
        children: enrollmentAreaRoutes,
    },
];
