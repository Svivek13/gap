import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { PasswordStrengthValidator } from '../sign-up/password-strength.validators';
import { get as _get } from 'lodash';
import { MlopsService } from '../mlops.service';
import { ActivatedRoute, Router } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

function passwordMatchValidator(password: string): ValidatorFn {
  return (control: FormControl) => {
    if (!control || !control.parent) {
      return null;
    }
    return control.parent.get(password).value === control.value ? null : { mismatch: true };
  };
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPwFormGroup: FormGroup;
  hide = true;
  loader: boolean;
  resetPwErrorMessage = '';
  token: any;

  constructor(private fb: FormBuilder, private mlopsService: MlopsService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.token = this.activatedRoute.snapshot.queryParams.token;
    this.forgotPwFormGroup = this.fb.group({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8), PasswordStrengthValidator]),
      confirmPw: new FormControl('', [Validators.required, passwordMatchValidator('newPassword')]),
    });
  }

  get newPwFormControl() { return this.forgotPwFormGroup.get('newPassword'); }
  get confirmPwFormControl() { return this.forgotPwFormGroup.get('confirmPw'); }

  matcher = new MyErrorStateMatcher();

  ngOnInit(): void {
    localStorage.removeItem('userEmail');
  }

  resetPassword = (event) => {
    this.loader = true;
    if (this.forgotPwFormGroup.valid) {
      const body = {
        resetToken: this.token,
        password: _get(this.forgotPwFormGroup, 'value.newPassword'),
        confirmPassword: _get(this.forgotPwFormGroup, 'value.confirmPw')
      };
      this.mlopsService.createNewPassword(body).subscribe(response => {
        this.loader = false;
        if (response.data.message) {
          this.router.navigate(['login']);
        }
        // console.log(response);
        this.resetPwErrorMessage = '';
      }, err => {
        this.resetPwErrorMessage = _get(err, 'error.message');
        this.loader = false;
      }
      );
    } else {
      this.loader = false;
    }
  }

}
