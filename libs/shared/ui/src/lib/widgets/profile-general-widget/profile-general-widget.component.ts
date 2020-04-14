import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mp-profile-general-widget',
  templateUrl: './profile-general-widget.component.html',
  styleUrls: ['./profile-general-widget.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileGeneralWidgetComponent implements OnInit {
  @Input() data;

  public isEditState: Boolean;

  gender = [
    { value: 'Female', label: 'Female' },
    { value: 'Male', label: 'Male' },
    { value: 'Other', label: 'Other' }
  ];

  constructor() {}

  ngOnInit(): void {}

  onChangeParams(value, key) {
    this.data[key] = value;
  }

  submit() {
    console.log(this.data);
  }
}
