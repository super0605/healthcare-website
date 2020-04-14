import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '[mp-checkbox]',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.less']
})
export class CheckboxComponent implements OnInit {
  @Input() autoFocus: boolean;
  @Input() disabled: boolean;
  @Input() ngModel: boolean;
  @Input() value: string;
  @Input() indeterminate: boolean;
  @Output() public ngModelChange = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  public onModalChange(checked: boolean) {
    this.ngModelChange.emit(checked);
  }
}
