import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';

export interface selectOptions {
  label: string;
  value: string;
}

@Component({
  selector: 'mp-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DropdownComponent implements OnInit {
  @Input() placeholder: string;
  @Input() class: string;
  @Input() selectedValue: any;
  @Input() loading: boolean;
  @Input() disabled: boolean;
  @Input() options: Array<selectOptions>;
  @Output() public changed = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  compareFn = (o1: any, o2: any) =>
    o1 && o2 ? o1.value === o2.value : o1 === o2;

  public onChange(event) {
    this.changed.emit(event);
  }
}
