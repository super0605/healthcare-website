import { Component, OnInit } from '@angular/core';
import { StartupService } from '@medopad/clinician-app/services';

@Component({
  selector: 'mp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(private startupservice: StartupService) {}

  ngOnInit(): void {
    console.log('LoginComponent ===>');
    this.startupservice
      .getPatients()
      .subscribe(resp => console.log('GET CUSTOMER ==>', resp));
  }
}
