import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mp-profile-clinical-history-widget',
  templateUrl: './profile-clinical-history-widget.component.html',
  styleUrls: ['./profile-clinical-history-widget.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileClinicalHistoryWidgetComponent implements OnInit {
  @Input() data;

  public isEditState: Boolean;

  constructor() {}

  ngOnInit(): void {}

  onChangeParams(value, key) {
    this.data[key] = value;
  }

  submit() {
    console.log(this.data);
  }
}
