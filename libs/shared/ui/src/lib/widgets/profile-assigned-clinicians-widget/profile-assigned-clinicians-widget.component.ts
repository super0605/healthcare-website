import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mp-profile-assigned-clinicians-widget',
  templateUrl: './profile-assigned-clinicians-widget.component.html',
  styleUrls: ['./profile-assigned-clinicians-widget.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileAssignedCliniciansWidgetComponent implements OnInit {
  @Input() data;

  menuItems = [{ value: 'add_clinician', label: 'Add Clinician' }];

  patientCliniciansStatus = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Make Writer', label: 'Make Writer' },
    { value: 'Make Reader', label: 'Make Reader' },
    { value: 'Remove', label: 'Remove' }
  ];

  constructor() {}

  ngOnInit(): void {}

  onSubmitAction(event): void {
    // TO DO Add new clinician
  }
}
