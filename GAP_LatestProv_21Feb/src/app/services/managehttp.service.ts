import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpcancelService } from './httpcancel.service';

@Injectable({
  providedIn: 'root'
})
export class ManagehttpService {

  constructor(router: Router,
    private httpCancelService: HttpcancelService) {
    router.events.subscribe(event => {
      // An event triggered at the end of the activation part of the Resolve phase of routing.
      if (event instanceof ActivationEnd) {
        // Cancel pending calls
        this.httpCancelService.cancelPendingRequests();
      }
    });
  }

  // todo: do not cancel tracking metrics network requests
  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    // console.log('inside managehttp interceptor');
    // console.log('req details: ', req);
    if (req.url.includes('tracking-metrics')) {
      return next.handle(req);
    } else {
      return next.handle(req).pipe(takeUntil(this.httpCancelService.onCancelPendingRequests()))
    }
  }
}
