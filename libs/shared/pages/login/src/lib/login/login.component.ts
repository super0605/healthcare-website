import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MpMessageService } from '@medopad/shared/mpui';
import { locales } from '@medopad/shared/locales';

@Component({
  selector: 'mp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  submiting = false;
  loginSteps: any = ['first-step', 'second-step'];
  activeStep: string;
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

    this.submiting = true;

    setTimeout(() => {
      this.message.info('');
      this.submiting = false;
      this.router.navigateByUrl('/patients');
    }, 500);
  }

  gotoNextStep() {
    this.validateForm.get('email').markAsDirty();
    this.validateForm.get('email').updateValueAndValidity();

    if (!this.validateForm.get('email').valid) {
      return false;
    }

    if (this.activeStep === 'first-step') {
      this.activeStep = this.loginSteps[1];
    }
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private message: MpMessageService
  ) {}

  ngOnInit(): void {
    this.locales = locales;
    this.activeStep = this.loginSteps[0];
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }
}
