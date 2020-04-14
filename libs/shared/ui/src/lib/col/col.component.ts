import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[mp-col]',
  templateUrl: './col.component.html',
  styleUrls: ['./col.component.less']
})
export class ColComponent implements OnInit {
  @Input() flex: number | string;
  @Input() offset: number;
  @Input() order: number;
  @Input() pull: number;
  @Input() push: number;
  @Input() span: number;
  @Input() xs: number | object;
  @Input() sm: number | object;
  @Input() md: number | object;
  @Input() lg: number | object;
  @Input() xl: number | object;
  @Input() xxl: number | object;

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
