import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[mp-row]',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.less']
})
export class RowComponent implements OnInit {
  @Input() gutter: number | object | string[];
  @Input() type: string = 'flex';
  @Input() align: 'top' | 'middle' | 'bottom';
  @Input() justify:
    | 'start'
    | 'end'
    | 'center'
    | 'space-around'
    | 'space-between';

  constructor() {}

  ngOnInit(): void {}
}
