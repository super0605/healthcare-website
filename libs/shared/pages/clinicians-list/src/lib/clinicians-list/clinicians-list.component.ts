import { Component, OnInit } from '@angular/core';
import { CliniciansListEntity } from '../+state/clinicians-list.models';
import { CliniciansListFacade } from '../+state/clinicians-list.facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'mp-clinicians-list',
  templateUrl: './clinicians-list.component.html',
  styleUrls: ['./clinicians-list.component.less']
})
export class CliniciansListComponent implements OnInit {
  clinicianslist$: Observable<CliniciansListEntity[]>;
  listOfData: any[] = [];
  gridOptions: any[] = [];
  pageSize = 20;

  constructor(private facade: CliniciansListFacade) {}

  ngOnInit(): void {
    this.setGridOptions();
    this.subscribes();
    this.getAllClinicians();
  }

  setGridOptions() {
    this.gridOptions = [
      { name: 'familyName', displayName: 'NAME' },
      {
        name: 'numOfPatients',
        displayName: 'NUMBER OF PATIENTS',
        width: 225,
        align: 'left'
      }
    ];
  }

  getAllClinicians() {
    this.facade.getAllClinicians();
  }

  subscribes() {
    this.facade.allCliniciansList$.subscribe(cliniciansList => {
      this.listOfData = cliniciansList;
    });
  }
}
