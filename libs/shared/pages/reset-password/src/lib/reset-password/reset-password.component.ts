import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { locales } from '@medopad/shared/locales';

@Component({
  selector: 'mp-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less']
})
export class ResetPasswordComponent implements OnInit {
  validateForm: FormGroup;
  submiting = false;
  formSteps: any = ['password_check', 'reset_password'];
  activeStep: string;
  locales: object;

  submitForm() {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    console.log('submitForm', this.validateForm);

    if (!this.validateForm.valid) {
      return false;
    }

    this.submiting = true;
    setTimeout(() => {
      this.submiting = false;
      this.router.navigate(['/login']);
    }, 1000);
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notSame: true };
  }

  gotoNextStep() {
    this.validateForm.get('password').markAsDirty();
    this.validateForm.get('password').updateValueAndValidity();

    if (!this.validateForm.get('password').valid) {
      return false;
    }

    if (this.activeStep === 'password_check') {
      this.activeStep = this.formSteps[1];
    }
  }

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.locales = locales;
    this.activeStep = this.formSteps[0];

    this.validateForm = this.fb.group(
      {
        password: [null, [Validators.required]],
        confirmPassword: [null, [Validators.required]]
      },
      { validator: this.checkPasswords }
    );
  }
}
