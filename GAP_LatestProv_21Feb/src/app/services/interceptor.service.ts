import { Injectable } from '@angular/core';

import {
  HttpInterceptor, HttpRequest,
  HttpHandler, HttpEvent, HttpErrorResponse
  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private router: Router) { }
  handleError(error: HttpErrorResponse, req){
    // console.log("lalalalalalalala", this.router.url);
    if (error.status === 401) {
      this.router.navigate(['login'], { queryParams: { returnUrl: this.router.url }});
      // this.router.navigate(['login']);
    }
    return throwError(error);
   }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>>{
      return next.handle(req)
      .pipe(
        catchError((error) => this.handleError(error, req))
      );
    }
}
