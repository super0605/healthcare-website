import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface inputType {
  minRows: number;
  maxRows: number;
}

@Component({
  selector: '[mp-input]',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.less']
})
export class InputComponent implements OnInit {
  @Input() type: string = 'text';
  @Input() size: 'large' | 'small' | 'default';
  @Input() autoSize: boolean | inputType;
  @Input() placeholder: string;
  @Input() name: string;
  @Input() disabled: boolean;
  @Input() value: string;
  @Output() public changed = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  onChange(event) {
    this.changed.emit(event);
  }
}
