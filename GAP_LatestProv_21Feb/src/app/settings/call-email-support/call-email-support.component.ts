import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MlopsService } from 'src/app/mlops.service';

@Component({
  selector: 'app-call-email-support',
  templateUrl: './call-email-support.component.html',
  styleUrls: ['./call-email-support.component.scss']
})
export class CallEmailSupportComponent implements OnInit {

  supportFormGroup = new FormGroup({
    subject: new FormControl(''),
    query: new FormControl('')
  });

  constructor(private mlopsService: MlopsService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  supportSubmit = (event) => {
    const obj = {
      subject: this.supportFormGroup.get('subject').value,
      query: this.supportFormGroup.get('query').value
    };
    this.mlopsService.supportTicket(obj).subscribe((res) => {
      this.snackBar.open(res.data.message, 'Ok', {
        duration: 4000
      });
      this.supportFormGroup.reset();
    },
    err => {
      console.log(err);
    });
  }

}
