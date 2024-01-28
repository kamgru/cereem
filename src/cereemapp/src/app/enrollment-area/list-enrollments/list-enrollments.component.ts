import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {Router} from "@angular/router";
import {IEnrollmentItem, ListEnrollmentsService} from "./list-enrollments.service";

@Component({
    selector: 'app-list-enrollments',
    standalone: true,
    imports: [
        AsyncPipe
    ],
    templateUrl: './list-enrollments.component.html',
    styleUrl: './list-enrollments.component.css'
})
export class ListEnrollmentsComponent {

  @ViewChild('searchInput')
  searchInput?: ElementRef<HTMLInputElement>;

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.listContacts.tryHandleKey(event)) {
      return;
    }

    if (event.ctrlKey && event.key == '/') {
      this.searchInput?.nativeElement.focus();
      event.preventDefault();
    } else if (event.key == 'Escape') {
      this.searchInput?.nativeElement.blur();
    }
  }

  public totalPages_$ = this.listContacts.totalPages_$;
  public currentIndex_$ = this.listContacts.currentIndex_$;
  public pageSize_$ = this.listContacts.pageSize_$;
  public page_$ = this.listContacts.page_$;
  public enrollments$ = this.listContacts.enrollments$;

  constructor(
      private listContacts: ListEnrollmentsService,
      private router: Router
  ) {
    const subscription = this.listContacts.selectedContact$
        .subscribe(enrollment => {
          this.router.navigate([`enrollments/details/${enrollment.enrollmentId}`])
              .then(_ => {
                subscription.unsubscribe();
              });
        })
  }

  public changePageSize = (value: number) => this.listContacts.changePageSize(value);
  public tryNextPage = () => this.listContacts.tryNextPage();
  public tryPrevPage = () => this.listContacts.tryPrevPage();
  public sortBy = (value: string) => this.listContacts.sortBy(value);
  public search = (value: string) => this.listContacts.search(value);

  handleRowClick(index: number, enrollment: IEnrollmentItem) {
    this.currentIndex_$.set(index);
    this.router.navigate([`enrollments/details/${enrollment.enrollmentId}`])
        .then(_ => {
        });
  }
}
