import {Component} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ContactService, IContact} from "../contact.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-add-contact',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './add-contact.component.html',
    styleUrl: './add-contact.component.css'
})
export class AddContactComponent {

    public contactForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        company: '',
        email: '',
        phone: '',
    });

    constructor(
        private formBuilder: FormBuilder,
        private contactService: ContactService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
    }

    onSubmit() {
        if (this.contactForm.valid) {
            this.contactService.addContact(<IContact>this.contactForm.value)
                .subscribe(x => {
                    console.log(x);
                    this.router.navigate(['list'], {relativeTo: this.activatedRoute.parent})
                        .then(() => {});
                })
        }
    }
}
