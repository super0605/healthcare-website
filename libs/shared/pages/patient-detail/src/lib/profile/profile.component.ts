import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileFacade } from './+state/profile.facade';

export interface GeneralData {
  gender: String;
  birth: String;
  mobile: String;
  address: String;
}

@Component({
  selector: 'medopad-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  patient;
  generalData = {} as GeneralData;

  //----------------------------------------------hard code

  clinicians = [
    { name: 'Dr Sam Smith', role: 'Admin' },
    { name: 'Dr Kate Wright', role: 'Admin' },
    { name: 'Dr Chloé Weilding', role: 'Admin' },
    { name: 'Dr James Omar', role: 'Admin' },
    { name: 'Dr Sean Dawson', role: 'Admin' }
  ];

  patientSurgeryData = {
    surgicalDate: '23 Jun 2019'
  };

  clinicianHistory = {
    comment: '',
    date: '',
    contact: '',
    specialist: ''
  };

  //

  constructor(
    private facade: ProfileFacade,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.getCurrentId();
    this.getCurrentPatient(id);
    this.subscribes();
  }

  getCurrentId() {
    return this.route.snapshot.params.id;
  }

  getCurrentPatient(id) {
    this.facade.getCurrentPatient(id);
  }

  subscribes() {
    this.facade.currentPatient$.subscribe(res => {
      if (res !== undefined) {
        this.patient = res;
        this.setGeneralTab(res.patient);
      }
    });
  }

  setGeneralTab(patient) {
    this.generalData.gender = patient.gender ? patient.phoneNumber : 'F';
    this.generalData.birth = patient.createdDateTime
      ? patient.createdDateTime
      : '00/00/00;';
    this.generalData.mobile = patient.phoneNumber ? patient.phoneNumber : '';
    this.generalData.address = patient.address ? patient.address : '';
  }
}
