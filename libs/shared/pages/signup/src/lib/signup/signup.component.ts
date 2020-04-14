import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { locales } from '@medopad/shared/locales';

@Component({
  selector: 'mp-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {
  validateForm: FormGroup;
  locales: object;
  submiting = false;

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
      this.router.navigateByUrl('/login');
    }, 1000);
  }

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.locales = locales;

    this.validateForm = this.fb.group({
      firstName: [null, [Validators.required]],
      surName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
      code: [null, [Validators.required]]
    });
  }
}
