import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {

  constructor(private injector: Injector) { }
  handleError(error: any) {
    const router = this.injector.get(Router);
    if (Error instanceof HttpErrorResponse) {
      console.log(error.status);
    }
    else {
      console.error("an error occurred here");
      console.error(error)
    }
    // not working directly. Had to refresh page for this navigation to work.
    // router.navigate(['error']);
  }
}
