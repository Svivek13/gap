import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup, ValidatorFn, FormBuilder} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { MlopsService } from '../mlops.service';
import { get as _get } from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { SummaryService } from '../views/summary/summary.service';
import { DataService } from '../services/data.service';
import { ThemeService } from '../theme/theme.service';
import { v4 as uuidv4 } from 'uuid';
import { AESEncryptDecryptServiceService } from '../services/aesencrypt-decrypt-service.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signUpErrorMessage: any;
  resetErrorMessage: string;
  verificationMessage: string;
  resendErrorMessage: string;
  tokenGenerated: any;
  loader = false;
  returnUrl: string;
  resetSuccess = false;
  resetError = false;
  resetSuccessMessage: string;
  verifyToken: string;
  showVerifyErrorMessage: boolean;
  verificationErrorMessage: any;
  showResendText = false;
  resendEmailId: any;
  reverified: boolean;
  matcher = new MyErrorStateMatcher();

  userLoginForm = {
    username: '',
    password: ''
  };

  constructor(private mlopsService: MlopsService, private router: Router,
              private dataService: DataService, private route: ActivatedRoute,
              private themeService: ThemeService,
              private aESEncryptDecryptServiceService: AESEncryptDecryptServiceService) { }

  errorMessage = '';
  resetPw = false;
  signIn = true;
  verMsgShown = false;


  formGroup = new FormGroup({
    loginemail: new FormControl('', [Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')]),
    password: new FormControl('', [Validators.required]),
  });


  resetFormGroup = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$'), Validators.minLength(1)])
  });


  get loginEmailFormControl() {
    // console.log(this.formGroup.get('loginemail'));
    if ( (this.formGroup.get('loginemail').hasError('pattern') || this.formGroup.get('loginemail').hasError('required') ) &&
    this.formGroup.get('loginemail').touched) {
      this.errorMessage = '';
      this.showVerifyErrorMessage = false;
      this.verificationErrorMessage = '';
    }
    return this.formGroup.get('loginemail');
  }
  get passwordFormControl() {
    // console.log(this.formGroup.get('password'));
    if (this.formGroup.get('password').hasError('required') &&
    this.formGroup.get('password').touched) {
      this.errorMessage = '';
      this.showVerifyErrorMessage = false;
      this.verificationErrorMessage = '';
    }
    return this.formGroup.get('password');
  }
  get userEmailFormControl() {
    if ((this.resetFormGroup.get('userEmail').hasError('pattern') ||
     this.resetFormGroup.get('userEmail').hasError('required')) && this.resetFormGroup.get('userEmail').touched) {
      this.resetSuccess = false;
      this.resetSuccessMessage = '';
      this.resetError = false;
      this.resetErrorMessage = '';
      this.showVerifyErrorMessage = false;
      this.verificationErrorMessage = '';
    }
    return this.resetFormGroup.get('userEmail');
  }

  getErrorMessage() {
    // console.log(this.formGroup.get('password').hasError('required'));
    // if (this.formGroup.get('password').hasError('required') === true) {
    //   this.errorMessage = '';
    // }
    return this.errorMessage;
  }

  loginFormReset = (event) => {
    event.currentTarget.reset();
    this.formGroup.reset();
  }

  resetFormReset = (event) => {
    event.currentTarget.reset();
    this.resetFormGroup.reset();
    this.resetError = false;
    this.resetSuccess = false;
  }

  ngOnInit(): void {
    this.themeUpdate(); // for theme update when user comes to login after logging out
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/help';

    this.tokenVerify();
  }

  private tokenVerify() {
    this.verifyToken = this.route.snapshot.queryParamMap.get('token');
    if (this.verifyToken !== null) {
      // console.log(this.verifyToken, 'tokenn');
      const verifyTokenBody = {
          token: this.verifyToken
        };
      this.mlopsService.emailVerification(verifyTokenBody).subscribe(resp => {
        // this.router.navigate(['/login']);
        this.verifyToken = null;
        localStorage.removeItem('userEmail');
        }, err => {
          this.showVerifyErrorMessage = true;
          this.verificationErrorMessage = _get(err, 'error.message.msg');
          if (_get(err, 'error.message.email')) {
            this.showResendText = true;
            this.resendEmailId = _get(err, 'error.message.email');
          } else {
            this.showResendText = false;
          }
          this.verifyToken = null;
          console.log(err);
        });
    }
  }

  // if verification failed, reverify called
  reverify() {
    this.showVerifyErrorMessage = false;
    this.verificationErrorMessage = '';
    const userEmail = localStorage.getItem('userEmail') || this.resendEmailId;
    const emailId = {
      email: userEmail
    };
    this.mlopsService.resendEmail(emailId).subscribe(response => {
      this.showVerifyErrorMessage = true;
      this.verificationErrorMessage = response.data.message;
      this.reverified = true;
    }, err => {
      this.showVerifyErrorMessage = true;
      this.verificationErrorMessage = _get(err, 'error.message');
      console.log(err);
    }
    );
}

  themeUpdate() {
    const active = this.themeService.getActiveTheme();
    if (active.name === 'light') {
      localStorage.setItem('theme', 'light');
    } else if (active.name === 'dark') {
      localStorage.setItem('theme', 'dark');
    }
  }
    // commented to check ui deploy
  userloginSubmit = (event) => {
    this.loader = true;
    if (this.formGroup.valid) {
      // reset form
      const body = {
        email: _get(this.formGroup, 'value.loginemail'),
        password: _get(this.formGroup, 'value.password')
      };
      this.mlopsService.userLogin(body).subscribe(
      response => {
        // let encryptedText = this._AESEncryptDecryptServiceService.encrypt("Hello World");
        // let decryptedText = this._AESEncryptDecryptServiceService.decrypt(encryptedText);

        const sessionId = uuidv4();
        localStorage.setItem('sessionId', sessionId);
        localStorage.setItem('userMail', this.aESEncryptDecryptServiceService.encrypt(_get(body, 'email')));

        this.loader = false;
        // setting userid to local storage
        // sessionStorage suggested, discuss with Prabhanshu
        localStorage.setItem('userId', _get(response, 'data.id'));
        // localStorage.setItem('token', _get(response, 'data.jwtToken'));
        localStorage.setItem('username', _get(response, 'data.name', 'User'));
        this.tokenGenerated = response.data.jwtToken;
        localStorage.setItem('token', this.tokenGenerated); // remember me feature
        this.mlopsService.validToken = this.tokenGenerated;
        this.dataService.validToken = this.tokenGenerated;
        this.mlopsService.loggedInUsername = response.data.name;

        this.errorMessage = '';

        // find the user is old or new, then decide which route to send to
        // this.checkUserOldOrNew();

        // defaulted to help page
        this.router.navigateByUrl(this.returnUrl);
      }, err => {
        this.errorMessage = _get(err, 'error.message');
        // setTimeout(_ => {
        //   this.errorMessage = '';
        // }, 5000);
        this.loader = false;
      }
      );
      this.loginFormReset(event);
    } else {
      this.loader = false;
    }
  }

  private checkUserOldOrNew() {
    this.mlopsService.checkUserOldOrNew().subscribe(response => {
      if (response.data.newUser === 'n') {
        // send to overview if not new user
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/cockpit';
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/help';
        this.router.navigateByUrl(this.returnUrl);
      }
    }, err => {
      console.log('error occurred');
      // could not determine whether new user or not
      // send to setup
      this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/help';
      this.router.navigateByUrl(this.returnUrl);
    });
  }

  // Reset Password

resetPassword = (event) => {
    if (this.resetFormGroup.valid) {
      // reset pw form
      const object = {
        email: _get(this.resetFormGroup, 'value.userEmail')
      };
      this.mlopsService.resetPassword(object).subscribe(response => {
        this.resetSuccess = true;
        this.resetSuccessMessage = response.data.message;
        localStorage.setItem('userEmail', _get(object, 'email'));
      }, err => {
        this.resetError = true;
        this.resetErrorMessage = _get(err, 'error.message');
      }
      );
      this.resetFormReset(event);
    }
  }

signUpForm() {
    this.router.navigate(['sign-up']);
    this.signIn = false;
    this.resetPw = false;
  }

resetPasswordForm() {
    this.resetPw = true;
    this.signIn = false;
    this.resetFormGroup.reset();
  }
    // Resend Email

  resendEmail() {
    // const userEmail = localStorage.getItem('userEmail');
    // const emailId = {
    //   // email: _get(this.signUpFormGroup, 'value.email')
    //   email: userEmail
    // };
    // this.mlopsService.resendEmail(emailId).subscribe(response => {
    //   this.showSignUpSuccessMessage = false;
    //   this.showSignUpErrorMessage = false;
    //   this.showResendSuccessMessage = true;
    //   this.resendSuccessMessage = response.data.message;
    // }, err => {
    //   this.showSignUpSuccessMessage = false;
    //   this.showSignUpErrorMessage = false;
    //   this.showResendErrorMessage = true;
    //   this.resendErrorMessage = _get(err, 'error.message');
    //   console.log(err);
    // }
    // );
    this.resetSuccessMessage = '';
    const object = {
      email: localStorage.getItem('userEmail')
    };
    this.mlopsService.resetPassword(object).subscribe(response => {
      this.resetSuccess = true;
      this.resetSuccessMessage = response.data.message;
    }, err => {
      this.resetError = true;
      this.resetErrorMessage = _get(err, 'error.message');
    }
    );
  }
 }
