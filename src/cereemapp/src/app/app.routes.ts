import { Routes } from '@angular/router';
import {ContactAreaComponent} from "./contact-area/contact-area.component";
import {AddContactComponent} from "./contact-area/add-contact/add-contact.component";
import {ListContactsComponent} from "./contact-area/list-contacts/list-contacts.component";
import {ContactDetailsComponent} from "./contact-area/contact-details/contact-details.component";

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
    }
];
export const routes: Routes = [
    {
        path: 'contacts',
        component: ContactAreaComponent,
        children: contactAreaRoutes,
    },
];
