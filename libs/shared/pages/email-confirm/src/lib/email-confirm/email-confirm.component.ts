import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { locales } from '@medopad/shared/locales';

@Component({
  selector: 'mp-email-confirm',
  templateUrl: './email-confirm.component.html',
  styleUrls: ['./email-confirm.component.less']
})
export class EmailConfirmComponent implements OnInit {
  validateForm: FormGroup;
  formSteps: any = ['email-confirm-step', 'email-sent-step'];
  activeStep: string;
  submiting = false;
  locales: object;

  submitForm() {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }

    if (!this.validateForm.valid) {
      return false;
    }

    this.activeStep = this.formSteps[1];
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.locales = locales;
    this.activeStep = this.formSteps[0];

    this.validateForm = this.fb.group({
      email: [null, [Validators.required]]
    });
  }
}
