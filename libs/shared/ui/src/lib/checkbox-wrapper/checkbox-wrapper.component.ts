import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: '[mp-checkbox-wrapper]',
  templateUrl: './checkbox-wrapper.component.html',
  styleUrls: ['./checkbox-wrapper.component.less']
})
export class CheckboxWrapperComponent implements OnInit {
  @Output() public nzOnChange = new EventEmitter<string[]>();

  constructor() {}

  ngOnInit(): void {}

  public onChange(item: string[]) {
    this.nzOnChange.emit(item);
  }
}
