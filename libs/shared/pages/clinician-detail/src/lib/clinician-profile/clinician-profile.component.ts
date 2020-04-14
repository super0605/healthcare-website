import { Component, OnInit } from '@angular/core';
import { ClinicianProfileEntity } from '../+state/clinician-profile.models';
import { ClinicianProfileFacade } from '../+state/clinician-profile.facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'medopad-clinician-profile',
  templateUrl: './clinician-profile.component.html',
  styleUrls: ['./clinician-profile.component.less']
})
export class ClinicianProfileComponent implements OnInit {
  clinicianProfile: any = {};
  menuItems: any = [
    { label: 'Edit' },
    { label: 'Permissions' },
    { label: 'Add Patient' }
  ];
  patientList: any;
  gridOptions: any = { colDefs: [] };

  constructor(private facade: ClinicianProfileFacade) {
    this.clinicianProfile = {
      name: 'Dr. Sam Smith',
      id: 3094820139,
      email: 'sam.smith@medicalinstitution.com',
      mobile: '+44(0)7123456789',
      address: '47 High Road, London, W2 4XR'
    };

    this.gridOptions = {
      colDefs: [
        { name: 'familyName', displayName: 'NAME', width: '' },
        { name: 'dob', displayName: 'DATA OF BIRTH', width: '225px' },
        { name: 'lastActivityDateTime', displayName: 'NHS#', width: '225px' },
        { name: 'updatedDateTime', displayName: 'LAST UPDATE', width: '155px' },
        {
          name: 'button',
          displayName: '',
          cellTemplate: 'row[col.name]',
          width: '80px'
        }
      ]
    };
  }

  ngOnInit(): void {
    this.subscribes();
    this.getAllClinicians();
  }

  getAllClinicians() {
    this.facade.getClinicianProfile();
  }

  subscribes() {
    this.facade.allClinicianProfile$.subscribe(patientList => {
      this.patientList = patientList;
      console.log('clinicianProfile ====>', patientList);
    });
  }

  onChangeAction(event) {
    console.log('Action ======>', event.target.innerText);
  }

  onDeletePatientAction(event) {
    console.log('Delete a patient ======>', event);
  }
}
