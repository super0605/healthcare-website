import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[mp-form-label]',
  templateUrl: './form-label.component.html',
  styleUrls: ['./form-label.component.less']
})
export class FormLabelComponent implements OnInit {
  @Input() required: boolean;
  @Input() noColon: boolean;
  @Input() for: string;

  constructor() {}

  ngOnInit(): void {}
}
