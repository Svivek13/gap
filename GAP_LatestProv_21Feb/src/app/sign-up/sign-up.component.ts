import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { MlopsService } from '../mlops.service';
import { get as _get, isEmpty as _isEmpty } from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { PasswordStrengthValidator } from './password-strength.validators';
import { Country } from '@angular-material-extensions/select-country';
import { MatDialog } from '@angular/material/dialog';
import {CONSTANTS } from '../helpers/constant';
import { CommonModalPdfviewerComponent } from '../../shared/layout/common-modal-pdfviewer/common-modal-pdfviewer.component';

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
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpFormGroup: FormGroup;
  verificationErrorMessage: string;
  verMsgShown = false;
  signUpErrorMessage: any;
  verifyToken: string;
  signUpSuccessMessage: any;
  resendSuccessMessage: any;
  resendErrorMessage: any;
  showSignUpErrorMessage = false;
  showSignUpSuccessMessage = false;
  showResendErrorMessage = false;
  showResendSuccessMessage = false;
  showVerifyErrorMessage = false;
  hide = true;
  termChecked = false;
  termError = '';
  pdftype = {
    eulaAgreement: 'termsandcondition',

  };
  // pdfData = {
  //   'eulaagreement': {
  //     pdfsrc: 'assets/docs/endUserLicenseAgreement.pdf',
  //     header: "END USER LICENSE AGREEMENT"
  //   }

  // }

  // };

  constructor(private mlopsService: MlopsService, private router: Router, private fb: FormBuilder,
              private route: ActivatedRoute, public dialog: MatDialog) {
    this.signUpFormGroup = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$'), Validators.minLength(1)]),
      signUpPassword: new FormControl('', [Validators.required, Validators.minLength(8), PasswordStrengthValidator]),
      confpassword: new FormControl('', [Validators.required, passwordMatchValidator('signUpPassword')]),
      country: new FormControl(''),
      company: new FormControl(''),
      number: new FormControl(''),
      companyURL: new FormControl(''),
      refBy: new FormControl('', [Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$'), Validators.minLength(1)]),
    });
   }

  get nameFormControl() { 
    if (this.signUpFormGroup.get('name').hasError('required') && this.signUpFormGroup.get('name').touched ) {
      this.removeAllErrorMessages();
      this.removeAllSuccessMessages();
    }
    return this.signUpFormGroup.get('name'); 
  }
  get emailFormControl() { 
    if ((this.signUpFormGroup.get('email').hasError('required') ||
    this.signUpFormGroup.get('email').hasError('pattern')) && 
    this.signUpFormGroup.get('email').touched ) {
      this.removeAllErrorMessages();
      this.removeAllSuccessMessages();
    }
    return this.signUpFormGroup.get('email'); 
  }
  get refFormControl() { 
    if (
    this.signUpFormGroup.get('refBy').hasError('pattern') && 
    this.signUpFormGroup.get('refBy').touched ) {
      this.removeAllErrorMessages();
      this.removeAllSuccessMessages();
    }
    return this.signUpFormGroup.get('refBy'); 
  }
  get signUpPasswordFormControl() { 
    if (( this.signUpFormGroup.get('signUpPassword').hasError('required') ||
    this.signUpFormGroup.get('signUpPassword').hasError('minlength') ||
    this.signUpFormGroup.get('signUpPassword').hasError('passwordStrength') )
    &&
    this.signUpFormGroup.get('signUpPassword').touched) {
      this.removeAllErrorMessages();
      this.removeAllSuccessMessages();
    }
    return this.signUpFormGroup.get('signUpPassword'); 
  }
  get confpasswordFormControl() { 
    if ( (this.signUpFormGroup.get('confpassword').hasError('required') || this.signUpFormGroup.get('confpassword').hasError('mismatch')) 
    && 
    this.signUpFormGroup.get('confpassword').touched) {
      this.removeAllErrorMessages();
      this.removeAllSuccessMessages();
    }
    return this.signUpFormGroup.get('confpassword'); 
  }

  matcher = new MyErrorStateMatcher();

  signUpFormReset = (event) => {
    event.currentTarget.reset();
    this.signUpFormGroup.reset();
  }

  ngOnInit(): void {
    // this.verifyToken = this.route.snapshot.queryParamMap.get('token');
    // if (this.verifyToken !== null) {
    //   console.log(this.verifyToken, 'tokenn');
    //   const verifyTokenBody = {
    //       token: this.verifyToken
    //     };
    //   this.mlopsService.emailVerification(verifyTokenBody).subscribe(resp => {
    //     this.router.navigate(['/login']);
    //     this.verifyToken = null;
    //     localStorage.removeItem('userEmail');
    //     }, err => {
    //       this.showVerifyErrorMessage = true;
    //       this.verificationErrorMessage = _get(err, 'error.message');
    //       this.verifyToken = null;
    //       console.log(err);
    //     });
    // }
  }

  updateTermChecked() {
    this.termChecked = !this.termChecked;
    this.termError = '';

  }


  signUpSubmit = (event) => {
    if (!this.termChecked) {
        this.termError = 'Please check the terms and conditions';
        return;
    }

    if (this.signUpFormGroup.valid) {
      // remove previous success messages
      this.removeAllSuccessMessages();
      // signup form

      const obj = {
        name: _get(this.signUpFormGroup, 'value.name'),
        email: _get(this.signUpFormGroup, 'value.email'),
        password: _get(this.signUpFormGroup, 'value.signUpPassword'),
        country: _get(this.signUpFormGroup, 'value.country'),
        company: _get(this.signUpFormGroup, 'value.company'),
        phoneNumber: _get(this.signUpFormGroup, 'value.number'),
        companyUrl: _get(this.signUpFormGroup, 'value.companyURL'),
        refBy: _get(this.signUpFormGroup, 'value.refBy'),
      };
      this.mlopsService.userSignUp(obj).subscribe(response => {
        this.showSignUpSuccessMessage = true;
        this.signUpSuccessMessage = response.data.message;
        this.verMsgShown = true;
        localStorage.setItem('userEmail', _get(obj, 'email'));
      }, err => {
        this.showSignUpErrorMessage = true;
        this.signUpErrorMessage = _get(err, 'error.message');
        console.log(err);
      }
      );
      this.signUpFormReset(event);
    }
  }

  // Resend Email

  resendEmail() {
      const userEmail = localStorage.getItem('userEmail');
      const emailId = {
        // email: _get(this.signUpFormGroup, 'value.email')
        email: userEmail
      };

      this.showResendSuccessMessage = false;
      this.resendSuccessMessage = '';
      this.showSignUpSuccessMessage = false;
      this.signUpSuccessMessage = '';

      this.mlopsService.resendEmail(emailId).subscribe(response => {
        this.showSignUpSuccessMessage = false;
        this.showSignUpErrorMessage = false;
        this.showResendSuccessMessage = true;
        this.resendSuccessMessage = response.data.message;
      }, err => {
        this.showSignUpSuccessMessage = false;
        this.showSignUpErrorMessage = false;
        this.showResendErrorMessage = true;
        this.resendErrorMessage = _get(err, 'error.message');
        console.log(err);
      }
      );
  }


  signInForm() {
    this.router.navigate(['/login']);
    this.signUpFormGroup.reset();
  }

  // resetAllMessages(message) {
  //   this.showSignUpErrorMessage = false;
  //   this.showSignUpSuccessMessage = false;
  //   this.showResendErrorMessage = false;
  //   this.showResendSuccessMessage = false;
  //   this.showVerifyErrorMessage = false;
  // }

  openDialog(pdfType, fileUrl) {

    const dialogRef = this.dialog.open(CommonModalPdfviewerComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '90%',
      width: '70%',
      data: { pdfsrc: fileUrl, header: _get(CONSTANTS, `pdfType.${pdfType}.header`) },
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  openPDF(pdfType) {
    const body = { name: _get(CONSTANTS, `pdfType.${pdfType}.name`) };
    this.mlopsService.getMetaFile(body).subscribe(res => {
      // console.log(res, 'file res');
      const dataType = res.type;
      const binaryData = [];
      binaryData.push(res);

      const fileUrl = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
      this.openDialog(pdfType, fileUrl);
    });
  }

  removeAllErrorMessages() {
    this.showSignUpErrorMessage = false;
    this.signUpErrorMessage = '';
    this.showResendErrorMessage = false;
    this.resendErrorMessage = '';
    this.showVerifyErrorMessage = false;
    this.verificationErrorMessage = '';
  }
  removeAllSuccessMessages() {
    this.showSignUpSuccessMessage = false;
    this.showResendSuccessMessage = false;
    this.signUpSuccessMessage = '';
    this.resendSuccessMessage = '';
  }

}
