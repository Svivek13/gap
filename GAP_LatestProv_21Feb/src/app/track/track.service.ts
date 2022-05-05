import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { get as _get, isEmpty as _isEmpty } from 'lodash';
import { AESEncryptDecryptServiceService } from '../services/aesencrypt-decrypt-service.service';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  validToken: string;

  constructor(public http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _AESEncryptDecryptServiceService: AESEncryptDecryptServiceService) {
    this.validToken = localStorage.getItem('token'); // remember me change
  }

  trackingMetrics(event, description) {
    console.log(event);
    const sessionId = localStorage.getItem('sessionId');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const userMail = this._AESEncryptDecryptServiceService.decrypt(localStorage.getItem('userMail'));
    let screenName = this.router.url.split(';')[0];
    const eventType = _get(event, 'type') || _get(event, 'event.type') || _get(event, 'source.controlType') || _get(event, 'source.id') || event;
    const descriptionId = description;
    const value = _get(event, 'target.value') || _get(event, 'value');
    // const timestamp = event.timeStamp;
    const timestamp = Date.now();
    console.log('Tracking metrics: ', 
    'sessionId: ', sessionId, 
    ' username: ', username, 
    ' userId: ', userId,
    ' userMail: ', userMail,
    ' screenName: ', screenName, 
    ' eventType: ', eventType, 
    ' descriptionId: ', descriptionId, 
    ' value: ', value, 
    ' timestamp: ', timestamp);

    const body = {
      sessionId,
      username,
      userId,
      userMail,
      screenName,
      eventType,
      descriptionId,
      value,
      timestamp
    }
    // call api to store in cosmos
    
    this.saveTrackingMetrics(body).subscribe(
      (response) => {
      },
      (err) => {
        const errorMessage = _get(err, 'error.message');
      }
    );
  }

  saveTrackingMetrics(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/tracking-metrics', body, {
      headers,
    });
  }
}
