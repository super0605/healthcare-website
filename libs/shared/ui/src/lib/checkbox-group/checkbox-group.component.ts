import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface CheckboxItem {
  label: string;
  value: string;
  checked?: boolean;
}

@Component({
  selector: '[mp-checkbox-group]',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.less']
})
export class CheckboxGroupComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() ngModel: { label: string; value: string; checked?: boolean }[];
  @Output() public ngModelChange = new EventEmitter<CheckboxItem[]>();

  constructor() {}

  ngOnInit(): void {}

  public onModalChange(item: CheckboxItem[]) {
    this.ngModelChange.emit(item);
  }
}
