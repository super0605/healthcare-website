import { Component, OnInit } from '@angular/core';
import { ProfileFacade } from '../../../profile/+state/profile.facade';

@Component({
  selector: 'medopad-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.less']
})
export class PageHeaderComponent implements OnInit {
  public patient;

  constructor(public facade: ProfileFacade) {}

  ngOnInit(): void {
    this.subscribes();
  }

  subscribes() {
    this.facade.currentPatient$.subscribe(res => {
      if (res !== undefined) {
        this.patient = res.patient;
      }
    });
  }
}
