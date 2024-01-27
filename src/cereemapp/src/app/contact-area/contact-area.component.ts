import {Component, OnInit} from '@angular/core';
import {ListContactsComponent} from "./list-contacts/list-contacts.component";
import {AddContactComponent} from "./add-contact/add-contact.component";
import {RouterLink, RouterOutlet} from "@angular/router";
import {ContactService} from "./contact.service";

enum UiState {
    List = 'list',
    Add = 'add',
}

@Component({
    selector: 'app-contact-area',
    standalone: true,
    imports: [ListContactsComponent, AddContactComponent, RouterOutlet, RouterLink],
    templateUrl: './contact-area.component.html',
    styleUrl: './contact-area.component.css'
})
export class ContactAreaComponent implements OnInit{

    public uiState: UiState = UiState.List;

    onAdd(){
        this.uiState = UiState.Add;
    }

    protected readonly UiState = UiState;

    constructor(
        private contactService: ContactService,
    ) {
    }

    ngOnInit(): void {
        this.contactService.contacts$.subscribe((contacts) => {
            console.log(contacts);
        });
    }
}
