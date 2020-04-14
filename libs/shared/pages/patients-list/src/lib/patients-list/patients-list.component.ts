import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PatientsListFacade } from '../+state/patients-list.facade';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'mp-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class PatientsListComponent implements OnInit {
  listOfData: any[] = [];
  gridOptions: any = { colDefs: [] };

  constructor(
    private facade: PatientsListFacade,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setGridOptions();
    this.checkCurrentUrl();
    this.getAllPatients();
    this.subscribes();
  }

  setGridOptions() {
    this.gridOptions = {
      colDefs: [
        { name: 'familyName', displayName: 'NAME' },
        { name: 'dob', displayName: 'DATA OF BIRTH' },
        { name: 'updatedDateTime', displayName: 'LAST UPDATE' },
        { name: 'lastActivityDateTime', displayName: 'NHS#' },
        { name: 'keyVitals', displayName: 'KEY VITALS' },
        { name: 'button', displayName: '', cellTemplate: 'row[col.name]' }
      ]
    };
  }

  checkCurrentUrl() {
    if (this.router.url.includes('patients/my')) {
      this.getAllMyPatients();
    } else {
      this.getAllPatients();
    }
  }

  subscribes() {
    this.facade.allPatientsList$.subscribe(patientsList => {
      this.listOfData = patientsList;
    });
  }

  getAllPatients() {
    this.facade.getAllPatients();
  }

  getAllMyPatients() {
    this.facade.getAllMyPatients();
  }

  patientProfile(item) {
    this.router.navigate(['patient/detail/profile', item.data.id]);
  }
}
