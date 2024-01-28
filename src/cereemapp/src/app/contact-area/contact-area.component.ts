import {Component, OnInit} from '@angular/core';
import {ListContactsComponent} from "./list-contacts/list-contacts.component";
import {AddContactComponent} from "./add-contact/add-contact.component";
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {ListContactsService} from "./list-contacts/list-contacts.service";

@Component({
    selector: 'app-contact-area',
    standalone: true,
    imports: [ListContactsComponent, AddContactComponent, RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './contact-area.component.html',
    styleUrl: './contact-area.component.css',
    providers: [ListContactsService]
})
export class ContactAreaComponent {

    constructor(
        private router: Router,
        private listContactsService: ListContactsService,
    ) {
        this.listContactsService.selectedContact$.subscribe(x => {
            this.router.navigate(['contacts', 'details', x.contactId]);
        });
    }

}
