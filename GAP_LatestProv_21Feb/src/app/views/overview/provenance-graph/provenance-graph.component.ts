import { Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef, } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MlopsService } from '../../../mlops.service';



import * as mermaid from 'mermaid';
import { mapGraphReq, mapGraphDefinitions } from 'src/app/mapper/pipelineGraph';
import { get as _get, findIndex as _findIndex, isEmpty as _isEmpty, set as _set, find as _find, filter as _filter,
   concat as _concat, map as _map } from 'lodash';

import { enrichArrDataToObj } from '../../../helpers/commonUtils';
import * as SvgPanZoom from 'svg-pan-zoom';

declare var $: any;

// socket service
import { map } from 'rxjs/operators';
import {environment} from '../../../../environments/environment';


@Component({
  selector: 'app-provenance-graph',
  templateUrl: './provenance-graph.component.html',
  styleUrls: ['./provenance-graph.component.css']
})
export class ProvenanceGraphComponent implements OnInit {
  projectId: any;
  projectName: any;

  parentRow: any;
  graphResponse: any;
  graphDefinitions: any;
  loader: boolean;
  enrichedData: any;
  isChildExpanded = false;
  isIconView = false;

  jqueryThis: any;

  svgElement: any;
  svgPanZoom: any;

  colorNodes: any;




  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  private mlopsService: MlopsService) {
    this.projectId = data.projectId;
    this.projectName = data.projectName;
   }


  @ViewChild('mermaidDiv') mermaidDiv: ElementRef;
  config = {
    startOnLoad: false,
    theme: 'dark',
    flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        // curve: 'basis',
    },
    securityLevel: 'loose',
  };

  ngOnInit(): void {
    this.loader = false;
    this.colorNodes = {
      dataBrickColorNodes: [],
      adfColorNodes: [],
    };

    // // socket connection
    // this.socket.disconnect()
    // const userId = localStorage.getItem('userId');
    // this.socket.ioSocket.io.opts.query = { userId } //new options
    // this.socket.ioSocket.io.uri = environment.baseUrl //new uri
    // this.socket.connect(); //manually connection

    // end of socket connection

    //Real Time status
  // this.getMessage().subscribe(res => this.provenanceGraphUpdate(res),
  // err => this.provenanceGraphErr(err))

  }



   
// getMessage() {
  
//   return this.socket.fromEvent("provenance-update").pipe(map((data: any) => data));
// }

  provenanceGraphUpdate = (data) => {
    console.log('socket data', data);
    this.flowChartInit();
  }

  provenanceGraphErr = (err) => {
    console.log('socket err', err);
  }

  viewChange = () => {
    console.log('checking toggle');
    this.plotFlowChart({ data: this.graphResponse, jqueryself: this.jqueryThis, selectedId: null });
  };

  collapseAllChildren = ({ data, selectedId, jqueryself}) => {
    const newData = _get(data, 'data.properties.activities', []);
    const childOfSelectedId = _filter(newData, ['parentNodeId', selectedId]);
    if (!_isEmpty(childOfSelectedId)) {
      _map(childOfSelectedId, cs => {
      if (_get(cs, 'expandable') && _get(cs, 'isExpanded')) {
        const selectedObjectIndex = _findIndex(newData, ['nodeId', _get(cs, 'nodeId')]);
        _set(newData, `[${selectedObjectIndex}].isExpanded`, false);
        jqueryself.collapseAllChildren({ data, selectedId: _get(cs, 'nodeId'), jqueryself});
      }
    });

    }


  };

  // controlling collapse

  collapseHandler = ({ data, selectedId, selectedObject, jqueryself }) => {
    console.log('data', data, selectedId, selectedObject);
    const newData = _get(data, 'data.properties.activities', []);
    const selectedObjectIndex = _findIndex(newData, ['nodeId', selectedId]);
    if (!_isEmpty(selectedObject) && _get(selectedObject, 'expandable')) {
      if (_get(selectedObject, 'isExpanded')) {
        jqueryself.collapseAllChildren({ data, selectedId, jqueryself });
      }
      const enableExpand = _get(selectedObject, 'isExpanded') ? false : true;
      _set(newData, `[${selectedObjectIndex}].isExpanded`, enableExpand);
      jqueryself.isChildExpanded = enableExpand;
      return true;
    }
    return false;
  }

  panZoomIn = () => {
    this.svgPanZoom.zoomIn();
  }

  panZoomOut = () => {
    this.svgPanZoom.zoomOut();
  }

  panZoomReset = () => {
    this.svgPanZoom.resetZoom();
    this.svgPanZoom.center();
  }


  plotFlowChart = ({ data, jqueryself, selectedId }) => {
    jqueryself.enrichedData = enrichArrDataToObj({ data: _get(data, 'data.properties.activities', []), field: 'nodeId' });
    mermaid.initialize(this.config);
    const element: any = this.mermaidDiv.nativeElement;

    this.graphDefinitions = mapGraphDefinitions({ data, selectedId, colorNodes: this.colorNodes , iconView: this.isIconView});

    const graphDefinition = this.graphDefinitions;
    mermaid.render('graphDiv', graphDefinition, (svgCode, bindFunctions) => {
      element.innerHTML = svgCode;
      bindFunctions(element);
    });

    this.svgElement = document.querySelector('#graphDiv');
    if (this.svgElement) {
      this.svgElement.setAttribute('height', '100%');
      this.svgElement.setAttribute('width', '100%');
    
    

    // let svgPanZoom: SvgPanZoom.Instance = SvgPanZoom(this.svgElement, {
    //   viewportSelector: '.svg-pan-zoom_viewport',
    //   controlIconsEnabled: true
    // });

      this.svgPanZoom = SvgPanZoom(this.svgElement, {
        // viewportSelector: '.svg-pan-zoom_viewport',
        controlIconsEnabled: false,
        center: true,
        fit: true,
        zoomEnabled: true
      });
    }


    $('.node').each(function(i, item) {

      // $(".label-container").css({
      //   width: '300px !important'
      // });

      const splittedItemId = item.id.split('-');

      const itemId = splittedItemId[1];

      // let tooltipTitle;
      // if (!_isEmpty(_get(jqueryself.enrichedData, `${itemId}.name`, '')) && !_isEmpty(_get(jqueryself.enrichedData,
      //   `${itemId}.error`, {}))) {
      //   tooltipTitle = `${_get(jqueryself.enrichedData, `${itemId}.name`, '')}(${_get(jqueryself.enrichedData, `${itemId}.error.errorCode`, '')}: ${_get(jqueryself.enrichedData, `${itemId}.error.message`, '')})`;
      // } else {
      //   tooltipTitle = _get(jqueryself.enrichedData, `${itemId}.name`, '');
      // }

      let tooltipTitle;
      if (!_isEmpty(_get(jqueryself.enrichedData, `${itemId}.name`, '')) && !_isEmpty(_get(jqueryself.enrichedData,
        `${itemId}.error`, {}))) {
        if (_get(jqueryself.enrichedData, `${itemId}.output`)){
          tooltipTitle = `<div>Name: ${_get(jqueryself.enrichedData, `${itemId}.name`, '')}</div><div>Error: ${_get(jqueryself.enrichedData, `${itemId}.error.message`, '')}(${_get(jqueryself.enrichedData, `${itemId}.error.errorCode`, '')})</div><span><a href="${_get(jqueryself.enrichedData, `${itemId}.output.runPageUrl`)}" target="_blank" style="color: white"> View details</a></span></div>`;
        } else {
          tooltipTitle = `<div>Name: ${_get(jqueryself.enrichedData, `${itemId}.name`, '')}</div><div>Error: ${_get(jqueryself.enrichedData, `${itemId}.error.message`, '')}(${_get(jqueryself.enrichedData, `${itemId}.error.errorCode`, '')})</div>`;
        }

      } else {
        if (_get(jqueryself.enrichedData, `${itemId}.output`)) {
          tooltipTitle = `<div>Name: ${_get(jqueryself.enrichedData, `${itemId}.name`, '')}</div><div><span><a href="${_get(jqueryself.enrichedData, `${itemId}.output.runPageUrl`)}" target="_blank" style="color: white">View details</a></span></div>`;
        } else {
          tooltipTitle = `<div>Name: ${_get(jqueryself.enrichedData, `${itemId}.name`, '')}</div>`;
        }

      }

      // tooltip
      $(item).addClass('tooltip');
      $(item).attr({
        // title: 'tool tip check, hello!'
        // title: _get(jqueryself.enrichedData, `${itemId}.name`, '')
        title: tooltipTitle
      });


      // tooltip end


      $(item).css({
        cursor: 'pointer'
      });

      item.onclick = (e) => {
        console.log('events', e, jqueryself.graphResponse, itemId);
          let graphData;
          // if (_get(jqueryself.parentRow, 'pipelineName') === 'kc_mlops') {
          //   graphData = mockData1;
          // } else {
          //   graphData = jqueryself.graphResponse;
          // }
          graphData = jqueryself.graphResponse;
          const selectedObject = _find(_get(graphData, 'data.properties.activities', []), ['nodeId', itemId]);
          const updateChart = jqueryself.collapseHandler({ data: graphData, selectedId: itemId, selectedObject, jqueryself });
          console.log('expansion', jqueryself.isChildExpanded, updateChart);
          if (updateChart) {
            if (jqueryself.isChildExpanded) {
              const selectedNodeChild = _filter(_get(graphData, 'data.properties.activities', []), ['parentNodeId', itemId]);
              
              if (_isEmpty(selectedNodeChild)) {
                console.log('checking flow', selectedNodeChild);
                const body = { dbJobId: _get(selectedObject, 'dbJobId'), nodeId: itemId };
                jqueryself.loader = true;
                jqueryself.mlopsService.getGraphChildData(body).subscribe(response => {
                  const newData = !_isEmpty(_get(response, 'data.properties.activities', [])) ? _concat(_get(graphData, 'data.properties.activities', []), _get(response, 'data.properties.activities', [])) : _get(graphData, 'data.properties.activities', []);
                  _set(graphData, 'data.properties.activities', newData);
                  jqueryself.plotFlowChart({ data: graphData, jqueryself, selectedId: itemId });
                  jqueryself.loader = false;
                  }, err => {
                    jqueryself.loader = false;
                    console.log('error in graph fetch', err);
                  }
                );
              } else {
                jqueryself.plotFlowChart({ data: graphData, jqueryself, selectedId: itemId });
              }
            } else {
              jqueryself.plotFlowChart({ data: graphData, jqueryself, selectedId: itemId });
            }
            // jqueryself.plotFlowChart({ data: graphData, jqueryself });
          }


      };
    });




    $('.fa-check-circle-o').css({color: '#4e8a21'});
    $('.fa-plus-circle').css({color: 'blue'});
    $('.fa-minus-circle').css({color: 'blue'});
    $('.fa-spin').css({color: 'yellow'});
    $('.fa-customLoader').css({color: '#f39d3c'});
    $('.fa-times-circle-o').css({color: '#eb6060'});
    $('.fa-ban').css({ color: 'aaa9ae'});

    $('.fa-customLoader').addClass('fa fa-cog fa-spin fa-1x fa-fw');
    // $(".fa").addClass(' fa fa-3x');
    // $()

    // $('.tooltip').tooltipster();
    $('.tooltip').tooltipster({
      maxWidth: 500,
      contentAsHTML: true,
      interactive: true,
    });

  };


  flowChartInit = () => {
    this.jqueryThis = this;

    // dynamic chart



    const body = mapGraphReq({ data: { projectId: this.projectId, projectName: this.projectName }});

    this.loader = true;
    this.mlopsService.getGraphData(body).subscribe(response => {
        this.graphResponse = response;

        // let graphData;
        // if (_get(this.parentRow, 'pipelineName') === 'kc_mlops') {
        //   graphData = mockData1;
        // } else {
        //   graphData = response;
        // }
        let graphData = response;

        this.plotFlowChart({ data: graphData, jqueryself: this.jqueryThis, selectedId: null });
        this.loader = false;
      }, err => {
        this.loader = false;
        console.log('error in graph fetch', err);
      }
    );
  }

  public ngAfterViewInit(): void {
    this.flowChartInit();

  }

}
