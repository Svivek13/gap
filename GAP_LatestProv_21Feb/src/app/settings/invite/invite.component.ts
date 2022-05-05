import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MlopsService } from 'src/app/mlops.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  inviteFormGroup = new FormGroup({
    inviteEmail: new FormControl('', [Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')])
  });
  get inviteEmailFormControl() { return this.inviteFormGroup.get('inviteEmail'); }
  matcher = new MyErrorStateMatcher();
  sentSuccess = false;
  sentError = false;
  sentSuccessMsg = '';
  sentErrMsg = '';
  inviteText = 'Send';
  constructor(private mlopsService: MlopsService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  sendInvite = (event) => {
    this.inviteText = 'Sending...';
    const obj = {
      email: this.inviteFormGroup.get('inviteEmail').value,
    };
    this.mlopsService.sendInvite(obj).subscribe((res) => {
      // this.snackBar.open(res.data.message, 'Ok', {
      //   duration: 4000
      // });
      this.sentSuccess = true;
      this.sentSuccessMsg = res.data.message;
      setTimeout(() => {
        this.sentSuccess = false;
        this.sentSuccessMsg = '';
      }, 3000);
      this.formDirective.resetForm();
      this.inviteText = 'Send';
    },
    err => {
      this.sentSuccess = false;
      console.log(err);
      this.inviteText = 'Send';
    });
  }

}
