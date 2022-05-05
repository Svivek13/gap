import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Pipeline } from '../views/summary/summary.component';
import { SummaryService } from '../views/summary/summary.service';
import { tourDetails } from 'src/shared/tour';
import { TrackService } from '../track/track.service';
import { find as _find, isEmpty as _isEmpty, get as _get } from 'lodash';
import { AESEncryptDecryptServiceService } from '../services/aesencrypt-decrypt-service.service';
import { MlopsService } from '../mlops.service';
interface DriftNode {
  name: string;
  children?: DriftNode[];
  expanded: boolean;
}

const TREE_DATA: DriftNode[] = [
  {
    name: 'Data Scientist',
    children: [
      {
        name: 'Monitor',
        children: [
          { name: 'Drift', expanded: true },
          // {name: 'Performance', expanded: false},
          // {name: 'Explorer', expanded: false},
          // {name: 'Log', expanded: false},
        ],
        expanded: false
      }, {
        name: 'Explainability',
        children: [
          { name: 'Importance', expanded: false },
          // {name: 'Bias', expanded: false}
        ],
        expanded: false
      },
    ],
    expanded: true
  },
  {
    name: 'Business User',
    expanded: false
  },
  {
    name: 'Data Engineer',
    expanded: false
  }, {
    name: 'Data Quality Metrics',
    expanded: false
  }
];

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss'],
})
export class PersonaComponent implements OnInit {
  treeControl = new NestedTreeControl<DriftNode>((node) => node.children);
  treeSource = new MatTreeNestedDataSource<DriftNode>();
  dataTill: any;
  projectName: any;
  brand: string;
  showDrift = false;
  showExplainability: boolean;
  showDiabetes: boolean;
  activeNode = { name: 'Drift', expanded: false };
  filteredOptions: Observable<Pipeline[]>;
  projectSearchForm: FormGroup;
  options: any = [];
  projectId: any;
  projectExecType: string;
  execId: string;
  showTelco: boolean;
  createdBy: string;
  showBikeSharing: boolean;
  showBank: boolean;
  showBlurred: boolean;
  childNode = 'Drift';
  parentNode = 'Data Scientist - ';
  divider = '-';
  showDE: boolean;
  tours: any;
  showBlurredExplorer: boolean;
  showBlurredLog: boolean;
  showBlurredBias: boolean;
  showSearch = true;
  showClear = false;
  iconText = 'search';
  selectedTree: any;
  showDQM: boolean = false;
  modelName: any;
  modelObj: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private summaryService: SummaryService,
    private trackService: TrackService,
    private ref: ChangeDetectorRef,
    private aESEncryptDecryptServiceService: AESEncryptDecryptServiceService,
    private mlopsService: MlopsService
  ) {
    this.treeSource.data = TREE_DATA;

    let data = this.mlopsService.getModelDropdown();
    let dataObj = this.mlopsService.getDashboardInput();
    if (dataObj != undefined) {
      this.modelObj = JSON.stringify(dataObj);
    }
    // let data = JSON.parse(sessionStorage.getItem('objCockpit'));
    if (data != undefined) {
      this.options = data;
      // this.projectName = data;
      if (sessionStorage.getItem('projectName') == null) {
        this.modelName = 'Direct Mail';
        this.projectName = 'Direct_Mail';
      } else {
        this.modelName = (sessionStorage.getItem('projectName')).replace(/\_/g, ' ');
        this.projectName = sessionStorage.getItem('projectName');
      }

    } else {

      setTimeout(() => { this.fetchProjects() }, 1000);
    }
    // if (this.activatedRoute.snapshot.paramMap.get('data') !== null) {

    //   data = this.aESEncryptDecryptServiceService.decrypt(this.activatedRoute.snapshot.paramMap.get('data'));
    //   data = JSON.parse(data);
    // }

    this.projectId = _get(data, 'id');
    // if (!_isEmpty(this.projectName)) {
    //   sessionStorage.setItem('projectName', this.projectName);
    // }
    // if (!_isEmpty(this.projectId)) {
    //   sessionStorage.setItem('projectId', this.projectId);
    // }
    this.execId = _get(data, 'execId');
    //  this.projectExecType = _get(data, 'type');
    this.projectExecType = 'Drift'
    this.createdBy = _get(data, 'by');

  }

  hasChild = (_: number, node: DriftNode) =>
    !!node.children && node.children.length > 0

  changeState(node) {
    node.expanded = !node.expanded;
  }

  getActiveNode(node) {
    this.activeNode = node;
  }

  ngOnInit(): void {
    this.tours = tourDetails;
    this.createForm();
    // this.fetchProjects();
    if (sessionStorage.getItem('projectName') == null) {
      this.modelName = 'Direct Mail';
      this.projectName = 'Direct_Mail';
    } else {
    this.projectName = sessionStorage.getItem('projectName') || this.options[0].value;
    this.modelName = (sessionStorage.getItem('projectName')).replace(/\_/g, ' ') || (this.options[0].value).replace(/\_/g, ' ');

    }
    
    this.prepareMatTreeLeftNavigation();
    if (this.projectName == 'Store_Clustering') {
      this.getPersonaDetails('Importance');
    } else {
      this.getPersonaDetails('Drift');
    }

    // if(this.options.length>0){
    this.projectSearchForm.patchValue({
      projectName: this.projectName,
    });
    //}


  }

  prepareMatTreeLeftNavigation() {
    this.treeSource.data[0].children[0].expanded = false;
    this.treeSource.data[0].children[1].expanded = false;
    if (
      (this.projectExecType.includes('Drift') ||
        this.projectExecType.includes('drift')) &&
      (this.projectExecType.includes('Explainability') ||
        this.projectExecType.includes('explainability'))
    ) {
      this.treeSource.data[0].children[0].expanded = true;
      // todo: showing drift menu bold selected
      this.showDrift = true;
      this.showExplainability = false;
      this.showDiabetes = false;
      this.showTelco = false;
      this.showBikeSharing = false;
      this.showBank = false;
      this.showBlurred = false;
      this.showDE = false;
    } else if (
      (this.projectExecType.includes('Drift') ||
        this.projectExecType.includes('drift')) &&
      !(
        this.projectExecType.includes('Explainability') ||
        this.projectExecType.includes('explainability')
      )
    ) {
      this.treeSource.data[0].children[0].expanded = true;
      // todo: showing drift menu bold selected
      this.showDrift = true;
      this.showExplainability = false;
      this.showDiabetes = false;
      this.showTelco = false;
      this.showBikeSharing = false;
      this.showBank = false;
      this.showBlurred = false;
      this.showDE = false;
    } else if (
      (this.projectExecType.includes('Explainability') ||
        this.projectExecType.includes('explainability')) &&
      !(
        this.projectExecType.includes('Drift') ||
        this.projectExecType.includes('drift')
      )
    ) {
      this.treeSource.data[0].children[1].expanded = true;
      this.activeNode = { name: 'Importance', expanded: false };
      // todo: showing xai menu bold selected
      this.showDrift = false;
      this.showExplainability = true;
      this.showDiabetes = false;
      this.showTelco = false;
      this.showBikeSharing = false;
      this.showBank = false;
      this.showBlurred = false;
      this.showDE = false;
    }

  }

  createForm() {

    this.projectSearchForm = new FormGroup({
      projectName: new FormControl(''),
      // brand: new FormControl('')
    });
    //if(this.options.length>0){


    this.projectSearchForm.patchValue({
      projectName: this.projectName,
      // brand: this.brand,
    });
    // }

  }

  fetchProjects() {
    const obj = {}


    if (this.options.length <= 0) {
      // this.options = []


      this.mlopsService.getCockpitData(obj)
        .subscribe(res => {

          const data = res.data
          const displayArr = []
          data.map(data => {
            if (data.dependent_on == 'None') {
              displayArr.push(data.Name)
            }
          })
          const result = displayArr.map(word => word.replace(/\_/g, ' '));


          data.map(data => {
            if (data.dependent_on == 'None') {
              this.options.push({ show: (data.Name).replace(/\_/g, ' '), value: data.Name })
              // this.projectTypes.push({ show: data.dependent_on, value: data.dependent_on })
            }
          })

          // this.projectSearchForm.patchValue({
          //   projectName: this.options[0].value,
          //   // brand: this.brand,
          // });
        })
    }

  }
  // fetchProjects() {
  //   this.summaryService.getProjects().subscribe(
  //     (response) => {
  //       console.log('persona page projects search: ', response.data);
  //       this.options = response.data;
  //       // for case when user directly lands in persona page
  //       if (!this.activatedRoute.snapshot.paramMap.get('data')) {
  //         this.projectId =
  //           sessionStorage.getItem('projectId') || this.options[0].value;
  //         this.projectName =
  //           sessionStorage.getItem('projectName') ||
  //           this.options[0].displayText;

  //         this.projectSearchForm.patchValue({
  //           projectName: this.projectName,
  //         });
  //         // showing drift for first admin project by default
  //         this.getPersonaDetails('Drift');
  //         // expanding monitor to show drift menu
  //         this.treeSource.data[0].children[0].expanded = true;
  //         // todo: showing drift menu bold selected
  //         this.activeNode = { name: 'Drift', expanded: false };
  //       }
  //       this.projectOptionsFilter();
  //     },
  //     (err) => {
  //       console.log('error occurred');
  //     }
  //   );
  // }

  getProjDetails(value) {

    this.modelName = value.replace(/\_/g, ' ');
    const found = this.options.find((item) => item.value === value);
    this.projectId = found.value;
    this.execId = undefined;
    this.projectName = value
    // todo: check drift/xai and conditionally fetch drift/xai details

    this.getPersonaDetails(this.selectedTree);

    sessionStorage.setItem('projectName', value);
    // sessionStorage.setItem('projectId', found.value);
  }

  projectOptionsFilter() {
    try {
      this.filteredOptions = this.projectSearchForm
        .get('projectName')
        .valueChanges.pipe(
          startWith(''),
          map((value) =>
            typeof value === 'string' ? value : value.show
          ),
          map((name) => {
            return name ? this._filter(name) : this.options.slice();
          })
        );


    } catch (error) {
      console.error(error);
    }
  }

  private _filter(name: string): Pipeline[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(
      (option) => option.displayText.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  getPersonaDetails(event) {
    const selectedTree = event;
    this.selectedTree = event;
    if (selectedTree === 'Drift') {
      this.trackService.trackingMetrics('menu', '34');
      this.showDrift = true;
      this.showExplainability = false;
      this.showDiabetes = false;
      this.showTelco = false;
      this.showBikeSharing = false;
      this.showBank = false;
      this.showBlurred = false;
      this.showDE = false;
      this.parentNode = 'Data Scientist - ';
      this.childNode = 'Drift';
      this.divider = '-';
      this.showBlurredExplorer = false;
      this.showBlurredLog = false;
      this.showBlurredBias = false;
      this.treeSource.data[0].children[0].expanded = true;
      this.activeNode = { name: 'Drift', expanded: false };
    } else if (selectedTree === 'Importance') {
      this.trackService.trackingMetrics('menu', '34');
      this.importanceFalse();
      this.showExplainability = true;
    }

    else if (
      selectedTree === 'Business User' &&
      this.projectName === 'Diabetes'
    ) {
      this.trackService.trackingMetrics('menu', '35');
      this.showExplainability = false;
      this.showDrift = false;
      this.showDiabetes = true;
      this.showTelco = false;
      this.showBikeSharing = false;
      this.showBank = false;
      this.showBlurred = false;
      this.showDQM = false;
      this.showDE = false;
      this.parentNode = 'Business User - ';
      this.childNode = '';
      this.divider = '';
      this.showBlurredExplorer = false;
      this.showBlurredLog = false;
      this.showBlurredBias = false;
    } else if (
      selectedTree === 'Business User' &&
      this.projectName === 'Telecom Churn'
    ) {
      this.trackService.trackingMetrics('menu', '35');
      this.showExplainability = false;
      this.showDrift = false;
      this.showDiabetes = false;
      this.showTelco = true;
      this.showBikeSharing = false;
      this.showBank = false;
      this.showBlurred = false;
      this.showDQM = false;
      this.showDE = false;
      this.parentNode = 'Business User - ';
      this.childNode = '';
      this.divider = '';
      this.showBlurredExplorer = false;
      this.showBlurredLog = false;
      this.showBlurredBias = false;
    } else if (
      selectedTree === 'Business User' &&
      this.projectName === 'Bike Sharing'
    ) {
      this.trackService.trackingMetrics('menu', '35');
      this.showExplainability = false;
      this.showDrift = false;
      this.showDiabetes = false;
      this.showTelco = false;
      this.showBikeSharing = true;
      this.showBank = false;
      this.showBlurred = false;
      this.showDQM = false;
      this.showDE = false;
      this.parentNode = 'Business User - ';
      this.childNode = '';
      this.divider = '';
      this.showBlurredExplorer = false;
      this.showBlurredLog = false;
      this.showBlurredBias = false;
    } else if (
      selectedTree === 'Business User' &&
      this.projectName === 'Bank Marketing'
    ) {
      this.trackService.trackingMetrics('menu', '35');
      this.showExplainability = false;
      this.showDrift = false;
      this.showDiabetes = false;
      this.showTelco = false;
      this.showBikeSharing = false;
      this.showDQM = false;
      this.showBank = true;
      this.showBlurred = false;
      this.showDE = false;
      this.parentNode = 'Business User - ';
      this.childNode = '';
      this.divider = '';
      this.showBlurredExplorer = false;
      this.showBlurredLog = false;
      this.showBlurredBias = false;
    } else if (selectedTree === 'Business User') {
      this.showExplainability = false;
      this.showDrift = false;
      this.showDiabetes = false;
      this.showTelco = false;
      this.showBikeSharing = false;
      this.showDQM = false;
      this.showBank = false;
      this.showBlurred = true;
      this.showDE = false;
      this.parentNode = 'Business User - ';
      this.childNode = '';
      this.divider = '';
      this.showBlurredExplorer = false;
      this.showBlurredLog = false;
      this.showBlurredBias = false;
    }
    else if (selectedTree === 'Data Engineer') {
      this.showDE = false;
      this.showBlurred = false;
      this.ref.detectChanges();
      this.showDQM = false;
      this.trackService.trackingMetrics('menu', '36');
      this.showExplainability = false;
      this.showDrift = false;
      this.showDiabetes = false;
      this.showTelco = false;
      this.showBikeSharing = false;
      this.showBank = false;

      this.parentNode = 'Data Engineer - ';
      this.childNode = '';
      this.divider = '';
      this.showBlurredExplorer = false;
      this.showBlurredLog = false;
      this.showBlurredBias = false;

      //  if (this.isTemplateProject(this.projectName) === 'y') {
      this.showDE = true;
      this.showBlurred = false;
      // } else {
      //   this.showDE = false;
      //   this.showBlurred = true;
      // }
    }
    else if (selectedTree === 'Data Quality Metrics') {
      this.showDE = false;
      this.showBlurred = false;
      this.ref.detectChanges();

      this.trackService.trackingMetrics('menu', '35');
      this.showExplainability = false;
      this.showDrift = false;
      this.showDiabetes = false;
      this.showTelco = false;
      this.showBikeSharing = false;
      this.showBank = false;

      this.parentNode = 'Data Quality Metrics - ';
      this.childNode = '';
      this.divider = '';
      this.showBlurredExplorer = false;
      this.showBlurredLog = false;
      this.showBlurredBias = false;

      //  if (this.isTemplateProject(this.projectName) === 'y') {
      //   this.showDE = true;
      this.showDQM = true;
      this.showBlurred = false;
      // } else {
      //   this.showDE = false;
      //   this.showBlurred = true;
      // }
    }
  }
  private importanceFalse() {
    this.showExplainability = false;
    this.showDrift = false;
    this.showDiabetes = false;
    this.showTelco = false;
    this.showBikeSharing = false;
    this.showBank = false;
    this.showBlurred = false;
    this.parentNode = 'Data Scientist - ';
    this.childNode = 'Importance';
    this.divider = '-';
    this.showDE = false;
    this.showBlurredExplorer = false;
    this.showBlurredLog = false;
    this.showBlurredBias = false;
  }

  private isTemplateProject(name) {
    const templateProjects = [
      'Diabetes',
      'Bike Sharing',
      'Bank Marketing',
      'Telecom Churn',
    ];
    if (templateProjects.indexOf(name) !== -1) {
      return 'y';
    }
    return 'n';
  }

  dataTillSave(value) {
    this.dataTill = value;
  }

  afterStep24() {
    // also to expand Importance in left menu
    this.showExplainability = true;
    this.showDrift = false;
    this.showDiabetes = false;
    this.showTelco = false;
    this.showBikeSharing = false;
    this.showBank = false;
    this.showBlurred = false;
    this.parentNode = 'Data Scientist - ';
    this.childNode = 'Importance';
    this.divider = '-';
    this.showDE = false;
  }
  beforeStep25() {
    // also to expand Importance in left menu
    this.showExplainability = false;
    this.showDrift = true;
    this.showDiabetes = false;
    this.showTelco = false;
    this.showBikeSharing = false;
    this.showBank = false;
    this.showBlurred = false;
    this.parentNode = 'Data Scientist - ';
    this.childNode = 'Importance';
    this.divider = '-';
    this.showDE = false;
  }
  prevOfXAITour() {
    // drift to expand
    this.showExplainability = false;
    this.showDrift = true;
    this.showDiabetes = false;
    this.showTelco = false;
    this.showBikeSharing = false;
    this.showBank = false;
    this.showBlurred = false;
    this.parentNode = 'Data Scientist - ';
    this.childNode = 'Importance';
    this.divider = '-';
    this.showDE = false;
  }

  clearSearch() {
    this.projectSearchForm.patchValue({
      projectName: '',
    });
  }

  onHoverSearchIcon() {
    this.iconText = 'clear';
  }

  onLeaveSearchIcon() {
    this.iconText = 'search';
  }

  onStep22Next() {
    this.getPersonaDetails('Drift');
  }
}


