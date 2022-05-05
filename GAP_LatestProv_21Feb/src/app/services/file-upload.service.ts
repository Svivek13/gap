import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest, HttpResponse, HttpErrorResponse, HttpEvent, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

export enum FileQueueStatus {
  Pending,
  Success,
  Error,
  Progress
}

export class FileQueueObject {
  public file: any;
  public status: FileQueueStatus = FileQueueStatus.Pending;
  public progress = 0;
  public request: Subscription = null;
  public response: HttpResponse<any> | HttpErrorResponse = null;

  constructor(file: any) {
    this.file = file;
  }

  // actions
  public upload = () => { /* set in service */ };
  public cancel = () => { /* set in service */ };
  public remove = () => { /* set in service */ };

  // statuses
  public isPending = () => this.status === FileQueueStatus.Pending;
  public isSuccess = () => this.status === FileQueueStatus.Success;
  public isError = () => this.status === FileQueueStatus.Error;
  public inProgress = () => this.status === FileQueueStatus.Progress;
  public isUploadable = () => this.status === FileQueueStatus.Pending || this.status === FileQueueStatus.Error;

}

@Injectable()
export class FileUploadService {

  private endpoint = 'dummy-url';
  private queue: BehaviorSubject<FileQueueObject[]>;
  private files: FileQueueObject[] = [];

  constructor(private http: HttpClient) {
    this.queue = ( new BehaviorSubject(this.files) as BehaviorSubject<FileQueueObject[]>);
  }

  public postFile(fileToUpload: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('upload', fileToUpload, fileToUpload.name);
    const params = new HttpParams();
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {
      headers,
      params,
      reportProgress: true,
    };
    const req = new HttpRequest('POST', this.endpoint, formData, options);
    return this.http.request(req);
  }

  handleError(e: any) {
  }

}
