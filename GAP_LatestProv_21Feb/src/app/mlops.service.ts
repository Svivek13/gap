import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { find as _find, isEmpty as _isEmpty, get as _get } from 'lodash';
import * as myGlobals from './global';
import cleanDeep from 'clean-deep';
import { catchError } from 'rxjs/operators';
import { of, Subject, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
// import { Observable } from 'rxjs/Observable';
// import { catchError, retry } from 'rxjs/operators'
//     import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MlopsService {
  countryvalue: string;
  distributorvalue: string;
  validToken: any;
  loggedInUsername: string;
  targetObject: any;
  testObject: any;
  headers: HttpHeaders;
  execId: any;
  trainFilesForAddExec: any;
  testFilesForAddExec: any;
  tourSubject = new Subject<string>();
  themeSubject = new Subject<string>();
  public targetSubject = new Subject<any>();
  dashboardInput: any;
  modelDropdown: any;

  constructor(
    public http: HttpClient,
    private router: Router,
    private injector: Injector,
    private snackBar: MatSnackBar
  ) {
    this.validToken = localStorage.getItem('token'); // remember me change
    this.headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    // // console.log('running mlops constructor');
  }

  // get parent table data for home page
  getParentData() {
    return this.http.post<any>(
      environment.baseUrl + '/api/pipeline/runs/search',
      {}
    );
  }

  // get child table data for home page
  getChildData(id) {
    return this.http.post<any>(environment.baseUrl + '/api/pipeline/activity', {
      runId: id,
    });
  }

  getGraphData(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(
      environment.baseUrl + '/api/pipeline/runs/flowchart',
      body,
      { headers }
    );
  }

  getGraphChildData(body) {
    return this.http.post<any>(
      environment.baseUrl + '/api/pipeline/child',
      body
    );
  }

  userLogin(body) {
    return this.http.post<any>(environment.baseUrl + '/api/user/login', body);
  }

  createNewPassword(body) {
    return this.http.post<any>(environment.baseUrl + '/api/user/reset/password', body);
  }

  userSignUp(obj) {
    return this.http.post<any>(environment.baseUrl + '/api/user/signup', obj);
  }

  resetPassword(object) {
    return this.http.post<any>(
      environment.baseUrl + '/api/user/reset/password/request',
      object
    );
  }

  resendEmail(email) {
    return this.http.post<any>(
      environment.baseUrl + '/api/user/resend/email',
      email
    );
  }

  emailVerification(token) {
    return this.http.post<any>(environment.baseUrl + '/api/user/verify', token);
  }

  dropdownDataDS() {
    return this.http.get<any>(
      environment.baseUrl + '/api/dashboard/datascience/dropdown'
    );
  }


  dropdownDataBS() {
    return this.http.get<any>(
      environment.baseUrl + '/api/dashboard/businessuser/dropdown'
    );
  }

  dashboardData(designation, id) {
    return this.http.post<any>(environment.baseUrl + '/api/dashboard', {
      role: designation,
      pipelineId: id,
    });
  }

  prophet(pipeid, selectedcountry) {
    return this.http.post<any>(environment.baseUrl + '/api/dashboard/prophet', {
      pipelineId: pipeid,
      country: selectedcountry,
    });
  }

  distributorData() {
    return this.http.get<any>(
      environment.baseUrl +
      '/api/dashboard/dropdown/dist?country=' +
      this.countryvalue
    );
  }

  skuData() {
    return this.http.get<any>(
      environment.baseUrl +
      '/api/dashboard/dropdown/sku?dist=' +
      this.distributorvalue
    );
  }

  refreshDSDashboard(desgn, pipelineid, countrySel, distSel, skuSel) {
    return this.http.post<any>(environment.baseUrl + '/api/dashboard/filter', {
      role: desgn,
      pipelineId: pipelineid,
      country: countrySel,
      dist: distSel,
      sku: skuSel,
    });
  }

  refreshBUDashboard(desgn, pipelineid, countrySel) {
    return this.http.post<any>(environment.baseUrl + '/api/dashboard/filter', {
      role: desgn,
      pipelineId: pipelineid,
      country: countrySel,
    });
  }

  driftdetails(body) {
    return this.http.post<any>(
      environment.baseUrl + '/api/dashboard/drift/feature',
      body
    );
  }

  DEdata(desgn) {
    return this.http.post<any>(environment.baseUrl + '/api/dashboard', {
      role: desgn,
    });
  }

  DEdropdown() {
    return this.http.get<any>(
      environment.baseUrl + '/api/dashboard/dropdown/yearmonth'
    );
  }

  DErefresh(body) {
    return this.http.post<any>(
      environment.baseUrl + '/api/dashboard/filter',
      body
    );
  }

  getDataModels() {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.get<any>(
      environment.baseUrl + '/api/project/manual/data-model',
      { headers }
    );
  }

  getAutoConfigProjects() {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.get<any>(
      environment.baseUrl + '/api/projects/auto-configure',
      { headers }
    );
  }

  popupHeaders(obj) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http
      .post<any>(environment.baseUrl + '/api/project/file/header', obj, {
        headers,
      })
      .pipe(catchError((error) => of(error)));
  }

  popupTopTenHeaders(obj) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http
      .post<any>(environment.baseUrl + '/api/project/file/top-ten', obj, {
        headers,
      })
      .pipe(catchError((error) => of(error)));
  }

  uploadExecute(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/project', body, {
      headers,
    });
  }

  trackingMetrics(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/tracking-metrics', body, {
      headers,
    });
  }

  downloadFile(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(
      environment.baseUrl + '/api/project/file/download',
      body,
      { headers, responseType: 'blob' as 'json' }
    );
  }

  getMetaFile(body) {
    // this.validToken = localStorage.getItem('token');
    // const headers = new HttpHeaders().set(
    //   'Authorization',
    //   'Bearer ' + this.validToken
    // );
    return this.http.post<any>(
      environment.baseUrl + '/api/doc/meta/file',
      body,
      { responseType: 'blob' as 'json' }
    );
  }

  downloadFileFromAzure(name: string, callback) {
    this.downloadFile({ name }).subscribe(
      (response: any) => {
        callback();
        // // console.log(response);
        const dataType = response.type;
        const binaryData = [];
        binaryData.push(response);
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        if (name) {
          downloadLink.setAttribute('download', name);
        }
        document.body.appendChild(downloadLink);
        downloadLink.click();
      },
      (error) => {
        callback();
        const errorMessage = _get(error, 'error.message');
        this.snackBar.open(errorMessage, 'Ok', {
          duration: 2000,
        });
      }
    );
  }

  // projectsOverview(projName, startDate, endDate, driftPercentage, adminFilter) {
  //   let params = new HttpParams();
  //   params = params.append('adminFilter', adminFilter);
  //   if (driftPercentage) {
  //     params = params.append('driftByPercentage', driftPercentage);
  //   }
  //   if (projName) {
  //     params = params.append('name', projName);
  //   }
  //   if (startDate) {
  //     params = params.append('startDate', startDate);
  //   }
  //   if (endDate) {
  //     params = params.append('endDate', endDate);
  //   }
  //   this.validToken = localStorage.getItem('token');
  //   const headers = new HttpHeaders().set(
  //     'Authorization',
  //     'Bearer ' + this.validToken
  //   );
  //   return this.http.get<any>(environment.baseUrl + '/api/projects', {
  //     headers,
  //     params,
  //   });
  // }
  projectsOverview(projName, startDate, endDate, driftPercentage, adminFilter,model) {
    let params = new HttpParams();
    params = params.append('adminFilter', adminFilter);
    if (driftPercentage) {
      params = params.append('driftByPercentage', driftPercentage);
    }
    if (projName) {
      params = params.append('name', projName);
    }
    if (startDate) {
      params = params.append('startDate', startDate);
    }
    if (endDate) {
      params = params.append('endDate', endDate);
    }
    if(model){
      params = params.append('model',model);
    }
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.get<any>(environment.baseUrl + '/api/projects', {
      headers,
      params,
    });
  }

  driftData(payload) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/drift', payload, {
      headers,
    });
  }
  getCockpitData(payload) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/cockpitData', payload, {
      headers,
    });
  }
  driftDataRecord(payload) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/data-drift-record', payload, {
      headers,
    });
  }
  getBrandDropdown(payload) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/xai/brandDropdown', payload, {
      headers,
    });
  }
  getLocationDropdown(payload) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/xai/locationDropdown', payload, {
      headers,
    });
  }
  getBrandDMDropdown(payload) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/drift-brand-dropdown', payload, {
      headers,
    });
  }
  getLocationDMDropdown(payload) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/drift-location-dropdown', payload, {
      headers,
    });
  }
  getBrandDESyndDropdown(payload) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/de-dropdown-brand', payload, {
      headers,
    });
  }
  getLocationDESyndDropdown(payload) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/de-dropdown-location', payload, {
      headers,
    });
  }
  getAttributesDESyndDropdown(payload) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/de-dropdown-attribute', payload, {
      headers,
    });
  }
  driftDataData(payload) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/data-drift-data', payload, {
      headers,
    });
  }

  checkUniqueProject({ projectName }) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.get<any>(
      environment.baseUrl +
      `/api/projects/unique/projectname?name=${projectName}`,
      { headers }
    );
  }

  addExec(execId) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/exec', execId, {
      headers,
    });
  }

  getTopTenRecords(file) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(
      environment.baseUrl + '/api/projects/file/view',
      file,
      { headers }
    );
  }
  testDensity(obj) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );

    return this.http.post<any>(
      environment.baseUrl + '/api/test-density',
      obj,
      { headers }
    );


  }
  trainDensity(obj) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );

    return this.http.post<any>(
      environment.baseUrl + '/api/train-density',
      obj,
      { headers }
    );
  }
  testTrainChartData(obj) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    if (obj.card_type == "card") {
      return this.http.post<any>(
        environment.baseUrl + '/api/drift-train-test',
        obj,
        { headers }
      );
    } else if (obj.card_type == "noncard") {
      return this.http.post<any>(
        environment.baseUrl + '/api/dm-train-noncardProb',
        obj,
        { headers }
      );
    }

  }
  testProbChartData(obj) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    if (obj.card_type == "card") {
      return this.http.post<any>(
        environment.baseUrl + '/api/drift-test-prob',
        obj,
        { headers }
      );
    } else if (obj.card_type == "noncard") {
      return this.http.post<any>(
        environment.baseUrl + '/api/dm-test-noncardProb',
        obj,
        { headers }
      );
    }
  }
  dmTestCardRev(obj) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    if (obj.card_type == "card") {
      return this.http.post<any>(
        environment.baseUrl + '/api/dm-test-cardRev',
        obj,
        { headers }
      );
    } else if (obj.card_type == "noncard") { }
    return this.http.post<any>(
      environment.baseUrl + '/api/dm-test-noncardRev',
      obj,
      { headers }
    );
  }
  dmTrainCardRev(obj) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    if (obj.card_type == "card") {
      return this.http.post<any>(
        environment.baseUrl + '/api/dm-train-cardRev',
        obj,
        { headers }
      );
    }
    else if (obj.card_type == "noncard") {
      return this.http.post<any>(
        environment.baseUrl + '/api/dm-train-noncardRev',
        obj,
        { headers }
      );
    }
  }
  // dmTestnonCardRev(obj) {
  //   this.validToken = localStorage.getItem('token');
  //   const headers = new HttpHeaders().set(
  //     'Authorization',
  //     'Bearer ' + this.validToken
  //   );
  //   return this.http.post<any>(
  //     environment.baseUrl + '/api/dm-test-noncardRev',
  //     obj,
  //     { headers }
  //   );
  // }
  // dmTrainnonCardRev(obj) {
  //   this.validToken = localStorage.getItem('token');
  //   const headers = new HttpHeaders().set(
  //     'Authorization',
  //     'Bearer ' + this.validToken
  //   );
  //   return this.http.post<any>(
  //     environment.baseUrl + '/api/dm-train-noncardRev',
  //     obj,
  //     { headers }
  //   );
  // }
  // dmTestnonCardProb(obj) {
  //   this.validToken = localStorage.getItem('token');
  //   const headers = new HttpHeaders().set(
  //     'Authorization',
  //     'Bearer ' + this.validToken
  //   );
  //   return this.http.post<any>(
  //     environment.baseUrl + '/api/dm-test-noncardProb',
  //     obj,
  //     { headers }
  //   );
  // }
  // dmTrainnonCardProb(obj) {
  //   this.validToken = localStorage.getItem('token');
  //   const headers = new HttpHeaders().set(
  //     'Authorization',
  //     'Bearer ' + this.validToken
  //   );
  //   return this.http.post<any>(
  //     environment.baseUrl + '/api/dm-train-noncardProb',
  //     obj,
  //     { headers }
  //   );
  // }
  testSegmentDensity(obj) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );

    return this.http.post<any>(
      environment.baseUrl + '/api/segment_test',
      obj,
      { headers }
    );


  }
  trainSegmentDensity(obj) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );

    return this.http.post<any>(
      environment.baseUrl + '/api/segment_train',
      obj,
      { headers }
    );
  }
  segementFilter(obj) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );

    return this.http.post<any>(
      environment.baseUrl + '/api/segmentFilter_train',
      obj,
      { headers }
    );
  }

  getGlobalXai(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(
      environment.baseUrl + '/api/xai/global-chart',
      body,
      { headers }
    );
  }
  getXAI(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(
      environment.baseUrl + '/api/xai/global-chart-gap',
      body,
      { headers }
    );
  }

  getCompleteness(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(
      environment.baseUrl + '/api/DQM-Completeness',
      body,
      { headers }
    );
  }
  getUniqueness(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(
      environment.baseUrl + '/api/DQM-Uniqueness',
      body,
      { headers }
    );
  }
  getTimeliness(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(
      environment.baseUrl + '/api/DQM-timeliness',
      body,
      { headers }
    );
  }

  getLatestExec({ projectId }) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.get<any>(
      environment.baseUrl + `/api/project/latestExec/${projectId}`,
      { headers }
    );
  }

  getScatterPlot(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(
      environment.baseUrl + '/api/xai/scatter-plot',
      body,
      { headers }
    );
  }

  getScatterPlotNew(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/stratify', body, { headers });
  }

  getTestTrainDensity(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/test_train_plot', body, { headers });
    //return this.http.post<any>(environment.pythonServiceUrl + '/test_train_plot', body, { headers });
  }


  diabetesData(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/bu-metric', body, {
      headers,
    });
  }

  telcoData(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/bu-metric', body, {
      headers,
    });
  }

  bankData(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/bu-metric', body, {
      headers,
    });
  }

  bikeSharingData(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/bu-metric', body, {
      headers,
    });
  }

  faqData() {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.get<any>(environment.baseUrl + '/api/faq', { headers });
  }

  supportTicket(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(
      environment.baseUrl + '/api/support/ticket',
      body,
      { headers }
    );
  }

  sendInvite(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/user/invite', body, {
      headers,
    });
  }

  deData(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/de-metric', body, {
      headers,
    });
  }
  getDrillDownResult(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/de-drillDown', body, {
      headers,
    });
  }
  deSyndication(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/de-syndication', body, {
      headers,
    });
  }
  checkUserOldOrNew() {
    this.validToken = localStorage.getItem('token');
    const token = `Bearer ${this.validToken}`;
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get<any>
      (environment.baseUrl + '/api/projects/new-user', { headers });
  }

  fetchChartColorTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      const ticksColor = 'rgba(130,131,132,255)';
      const gridsColor = 'rgba(199,205,207,255)';
      return { ticksColor, gridsColor };
    } else if (theme === 'dark') {
      const ticksColor = 'rgba(255,255,255, 0.9)';
      const gridsColor = 'rgba(255,255,255, 0.3)';
      return { ticksColor, gridsColor };
    }
  }

  videoWelcomePage(body) {
    this.validToken = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.validToken
    );
    return this.http.post<any>(environment.baseUrl + '/api/meta/data', body, {
      headers,
    });
  }
  setDashbordInput(data) {
    this.dashboardInput = data;
    console.log(this.dashboardInput)
  }
  setDashbordInputAll(data) {
    this.dashboardInput = data;
    console.log(this.dashboardInput)
  }
  getDashboardInput() {
    return this.dashboardInput;
  }
  setModelDropwdown(data) {
    this.modelDropdown = data;
    // console.log(this.modelDropdown);

  }
  getModelDropdown() {
    return this.modelDropdown;
  }
}

