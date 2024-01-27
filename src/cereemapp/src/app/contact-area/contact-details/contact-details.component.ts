import {Component, HostListener, OnInit} from '@angular/core';
import {ContactDetailsService, IContactDetails} from "./contact-details.service";
import {ActivatedRoute, Router} from "@angular/router";
import {JsonPipe} from "@angular/common";

@Component({
    selector: 'app-contact-details',
    standalone: true,
    imports: [
        JsonPipe
    ],
    templateUrl: './contact-details.component.html',
    styleUrl: './contact-details.component.css'
})
export class ContactDetailsComponent implements OnInit {

    public contact?: IContactDetails;

    @HostListener('window:keydown', ['$event'])
    handleKey(event: KeyboardEvent){
       if (event.key == 'Escape'){
          this.router.navigate(['contacts/list']);
       }
    }

    constructor(
        private contactDetailsService: ContactDetailsService,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id') ?? '';

        this.contactDetailsService.getContactDetails(id)
            .subscribe(data => this.contact = data);
    }

}
