import {Component} from '@angular/core';

import {RouterOutlet} from '@angular/router';
import {ContactAreaComponent} from "./contact-area/contact-area.component";
import {SidenavComponent} from "./sidenav/sidenav.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ContactAreaComponent, SidenavComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'cereemapp';
}
