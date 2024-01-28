import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-enrollment-area',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './enrollment-area.component.html',
  styleUrl: './enrollment-area.component.css'
})
export class EnrollmentAreaComponent {

}
