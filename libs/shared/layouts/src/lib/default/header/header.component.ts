import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'mp-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  listItems = [
    { value: 'clinicians', label: 'Clinicians' },
    { value: 'myPatients', label: 'My Patients' },
    { value: 'allPatients', label: 'All Patients' }
  ];

  sortOptions = [
    { value: 'priority', label: 'Priority' },
    { value: 'last_active', label: 'Last Active' }
  ];

  menuItems = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  public selectedListItem;
  public selectedSortItem;

  constructor(private router: Router, public route: ActivatedRoute) {
    if (this.router.url.includes('patients/my')) {
      this.selectedListItem = this.listItems[1];
    } else if (this.router.url.includes('patient')) {
      this.selectedListItem = this.listItems[2];
    } else if (this.router.url.includes('clinicians')) {
      this.selectedListItem = this.listItems[0];
    }
    this.selectedSortItem = this.sortOptions[0];
  }

  onChange(event) {
    switch (event.value) {
      case 'allPatients':
        this.router.navigate(['patients']);
        break;
      case 'clinicians':
        this.router.navigate(['clinicians']);
        break;
      case 'myPatients':
        this.router.navigate(['patients/my']);
        break;
    }
  }

  goBackClick() {
    window.history.back();
  }
}
