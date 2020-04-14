import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';

@Component({
  selector: '[mp-form-control]',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.less']
})
export class FormControlComponent implements OnInit {
  @Input() validateStatus:
    | 'success'
    | 'warning'
    | 'error'
    | 'validating'
    | FormControl
    | NgModel;
  @Input() hasFeedback: boolean;
  @Input() extra: string | TemplateRef<void>;
  @Input() successTip:
    | string
    | TemplateRef<{ $implicit: FormControl | NgModel }>;
  @Input() warningTip:
    | string
    | TemplateRef<{ $implicit: FormControl | NgModel }>;
  @Input() errorTip: string | TemplateRef<{ $implicit: FormControl | NgModel }>;
  @Input() validatingTip:
    | string
    | TemplateRef<{ $implicit: FormControl | NgModel }>;

  constructor() {}

  ngOnInit(): void {}
}
