import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';
import * as myGlobals from '../../global';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  driftData: any;

  constructor(private dataService: DataService, private http: HttpClient) { }

  getProjects() {
    const token = `Bearer ${this.dataService.validToken}`;
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get<any>
    (environment.baseUrl + '/api/projects/dropdowns', {headers});
  }

  getProjectDetails(projectId) {
    const token = `Bearer ${this.dataService.validToken}`;
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get<any>
    (environment.baseUrl + `/api/project/${projectId}`, {headers});
  }
}
