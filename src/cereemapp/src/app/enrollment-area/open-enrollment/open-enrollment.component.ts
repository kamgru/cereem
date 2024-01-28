import {Component} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {OpenEnrollmentRequest, OpenEnrollmentService} from "./open-enrollment.service";
import {ListContactsService} from "../../contact-area/list-contacts/list-contacts.service";

@Component({
    selector: 'app-open-enrollment',
    standalone: true,
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './open-enrollment.component.html',
    styleUrl: './open-enrollment.component.css',
    providers: [ListContactsService]
})
export class OpenEnrollmentComponent {

    public openEnrollmentForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.maxLength(100)]],
        deadline: [new Date(), [Validators.required]]
    });

    constructor(
        private formBuilder: FormBuilder,
        private enrollmentService: OpenEnrollmentService
    ) {
    }

    handleSubmit() {
        if (this.openEnrollmentForm.valid) {
            const name = this.openEnrollmentForm.value.name ?? '';
            const deadline = new Date(this.openEnrollmentForm.value.deadline!);
            const req = new OpenEnrollmentRequest(name, deadline.toISOString());
            this.enrollmentService.openEnrollment(req).subscribe((enrollmentId) => {
                console.log(`Enrollment created with id ${enrollmentId}`);
            });
        }
    }
}
