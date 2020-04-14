import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'mp-profile-base-widget',
  templateUrl: './profile-base-widget.component.html',
  styleUrls: ['./profile-base-widget.component.less']
})
export class ProfileBaseWidgetComponent implements OnInit {
  @Input() title;
  @Input() data;
  @Output() public editStateChanged = new EventEmitter<any>();
  @Output() public submitEditForm = new EventEmitter<any>();
  @Output() public submitAction = new EventEmitter<any>();

  isEditState: Boolean = false;

  @Input()
  menuItems = [{ value: 'Edit', label: 'Edit' }];

  constructor() {}

  ngOnInit(): void {}

  onEdit(event) {
    switch (event) {
      case 'Edit':
        this.switchState();
        break;
    }
    this.submitAction.emit(event);
  }

  submit() {
    this.switchState();
    this.submitEditForm.emit();
  }

  switchState() {
    this.isEditState = !this.isEditState;
    this.editStateChanged.emit(this.isEditState);
  }
}
