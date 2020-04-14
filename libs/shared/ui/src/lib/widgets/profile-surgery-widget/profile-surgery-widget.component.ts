import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mp-profile-surgery-widget',
  templateUrl: './profile-surgery-widget.component.html',
  styleUrls: ['./profile-surgery-widget.component.less']
})
export class ProfileSurgeryWidgetComponent implements OnInit {
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
