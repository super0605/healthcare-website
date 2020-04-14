import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[mp-form]',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less']
})
export class FormComponent implements OnInit {
  @Input() layout: 'horizontal' | 'vertical' | 'inline';
  @Input() noColon: boolean;
  @Input() formGroup: string;

  constructor() {}

  ngOnInit(): void {}
}
