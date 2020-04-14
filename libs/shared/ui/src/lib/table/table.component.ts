import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mp-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class TableComponent implements OnInit {
  @Input() itemTpl;
  @Input() listOfData: object;
  @Input() class: string;
  @Input() gridOptions: any = [];
  @Input() pageSize = 10;

  constructor() {}

  ngOnInit(): void {}
}
