import { get as _get, reduce as _reduce, isEmpty as _isEmpty, map as _map, find as _find, filter as
    _filter, findIndex as _findIndex, includes as _includes } from 'lodash';
 import { cleanEntityData, enrichArrDataToObj } from '../helpers/commonUtils';
 import { CONSTANTS } from '../helpers/constant';
 
 const mapGraphReq = ({ data }) => cleanEntityData({
     projectId: _get(data, 'projectId'),
     projectName: _get(data, 'projectName')
 });
 
 // const findHighLevelParentNode = ({ data, nodeId }) => {
 
 // }
 
 const mapActivitiesString = ({ data, accumulator, selectedId, colorNodes, iconView }) => {
     let acc = accumulator;
     // console.log('parentNode', parentNode);
     const childNode = [];
     let count = 0;
     const failedLink = [];
     // let dataBrickNode = [];
     // let adfNode = [];
     // let dataBrickChildNode = [];
     // let adfChildNode = [];
     const isClickedNodeDataBrickColor = false;
     const dataBrickColorNode = [];
     const adfColorNode = [];
 
 
 
     // find expanded nodes
 
     const expandedNodes = _filter(data, { expandable: true, isExpanded: true });
     const expandedNodesArrToObj = enrichArrDataToObj({ data: expandedNodes, field: 'nodeId' });
     // console.log('expanded', expandedNodesArrToObj);
 
     // find clicked node  color
     // if (selectedId) {
     //     let isDataBrickColor = _includes(_get(colorNodes, 'dataBrickColorNodes'), selectedId);
     //     if (isDataBrickColor) {
     //         isClickedNodeDataBrickColor = true
     //     }
     // }
 
     // console.log('colorIdentifier', colorNodes, selectedId, isClickedNodeDataBrickColor);
 
     const response = _map(data, val => {
 
         const parentNode = _get(val, 'parentNodeId', '');
 
         // for node Color
         if (_get(val, 'pipelineCategory') === _get(CONSTANTS, 'pipelineCategory.adfPipeline')) {
             adfColorNode.push(_get(val, 'nodeId'));
         } else if (_get(val, 'pipelineCategory') === _get(CONSTANTS, 'pipelineCategory.dbNoteBookPipeline') ) {
             dataBrickColorNode.push(_get(val, 'nodeId'));
         }
 
         // return nodes if parentnode is not expanded so that it cannot be ploted
         if (!_isEmpty(parentNode) && _isEmpty(_get(expandedNodesArrToObj, parentNode, {}))) {
             return;
         } else if (!_isEmpty(parentNode) ) {
 
             // if (isClickedNodeDataBrickColor && (parentNode === selectedId) ) {
             //     colorNodes.dataBrickColorNodes.push(_get(val, 'nodeId'));
             // } else {
             //     if (!_includes(_get(colorNodes, 'dataBrickColorNodes'), _get(val, 'nodeId'))) {
             //         childNode.push(_get(val, 'nodeId'));
             //     }
 
             // }
 
         }
         // } else if (_isEmpty(parentNode)) {
         //     if ( _get(val, 'type') === _get(CONSTANTS, 'nodes.dataBrickNode')) {
         //         // dataBrickNode.push(_get(val, 'nodeId'));
         //         let isColorDefined = _includes(_get(colorNodes, 'dataBrickColorNodes'), _get(val, 'nodeId'));
         //         if (!isColorDefined) {
         //             colorNodes.dataBrickColorNodes.push(_get(val, 'nodeId'));
         //         }
 
         //     }
         // };
 
 
 
         const nodeStatus = !_isEmpty(_get(val, 'status')) ? _get(val, 'status').toLowerCase() : '';
         const statusIcon = nodeStatus === _get(CONSTANTS, 'status.success') ? _get(CONSTANTS, 'statusIcon.success') : nodeStatus === _get(CONSTANTS, 'status.fail') ? _get(CONSTANTS, 'statusIcon.fail') : nodeStatus === _get(CONSTANTS, 'status.cancel') ? _get(CONSTANTS, 'statusIcon.cancel') : nodeStatus === _get(CONSTANTS, 'status.inProgress') ? _get(CONSTANTS, 'statusIcon.inProgress') : undefined;
         const collpaseControlIcon = (_get(val, 'expandable') && _get(val, 'isExpanded')) ?
          _get(CONSTANTS, 'collapseControlIcon.collapse') : (_get(val, 'expandable') && !_get(val, 'isExpanded')) ? _get(CONSTANTS, 'collapseControlIcon.expand') : undefined;
         const typeIcon = iconView && _get(CONSTANTS, `activityTypeIcon.${_get(val, 'logicalActivityType')}`) ? _get(CONSTANTS, `activityTypeIcon.${_get(val, 'logicalActivityType')}`) : undefined;
         if (!_isEmpty(_get(val, 'dependsOn', []))) {
             _map(_get(val, 'dependsOn'), d => {
                 if (_get(d, 'dependencyConditions') === _get(CONSTANTS, 'status.fail')) {
                     // failedLink.push(count);
                 }
                 let findStage;
                 if (!_isEmpty(parentNode)) {
                     findStage = _find(data, {name:  _get(d, 'activity'), parentNodeId: parentNode});
                 } else {
                     findStage = _find( data, ['name', _get(d, 'activity')]);
                 }
                 if (!_isEmpty(findStage)) {
 
                     let concatString;
                     // concatString = `\n${_get(findStage, 'nodeId')} --> ${_get(val, 'nodeId')}(<div>
                     // <span style='font-size: 30px'>${!_isEmpty(statusIcon) ? statusIcon: ''}
                     // ${!_isEmpty(typeIcon) ? typeIcon: ''}</span> ${!_isEmpty(typeIcon) ? '':
                     // _get(val, 'name')} <span style='font-size: 30px'>${!_isEmpty(collpaseControlIcon)
                     // ? collpaseControlIcon : ''} </span></div>)`;
                     concatString = `\n${_get(findStage, 'nodeId')} --> ${_get(val, 'nodeId')}(${!_isEmpty(statusIcon) ? statusIcon : ''} ${!_isEmpty(typeIcon) ? typeIcon : ''} ${!_isEmpty(typeIcon) ? '' : _get(val, 'name')} ${!_isEmpty(collpaseControlIcon) ? collpaseControlIcon : ''})`;
                     acc = acc.concat(concatString);
                     count += 1;
                     // console.log('acc1', acc);
                 }
             });
         } else {
             if (!_isEmpty(parentNode) ){
                 const concatString = `\n${parentNode} -.->${_get(val, 'nodeId')}(${!_isEmpty(statusIcon) ? statusIcon : ''} ${!_isEmpty(typeIcon) ? typeIcon : ''} ${!_isEmpty(typeIcon) && !_isEmpty(parentNode) ? '' : _get(val, 'name')} ${!_isEmpty(collpaseControlIcon) ? collpaseControlIcon : ''})`;
                 acc = acc.concat(concatString);
                 count += 1;
                 // console.log('acc2', acc);
             } else {
                 const concatString = `\n${_get(val, 'nodeId')}(${!_isEmpty(statusIcon) ? statusIcon : ''} ${!_isEmpty(typeIcon) ? typeIcon : ''} ${!_isEmpty(typeIcon) ? '' : _get(val, 'name')} ${!_isEmpty(collpaseControlIcon) ? collpaseControlIcon : ''})`;
                 acc = acc.concat(concatString);
                 // console.log('acc2', acc);
             }
 
 
 
         }
         // console.log(acc, count);
 
 
     });
 
     return { accumulator: acc, failedLink, adfColorNode, dataBrickColorNode};
 };
 
 const mapGraphDefinitions = ({ data, selectedId, colorNodes, iconView }) => {
     let { accumulator: activitiesString, failedLink, adfColorNode, dataBrickColorNode } = mapActivitiesString({ data: _get(data, 'data.properties.activities'), accumulator: 'graph TB', selectedId, colorNodes, iconView});
     // console.log('colorNodes', colorNodes, childNode);
     // let children = childNode.join();
     const redLink = failedLink.join();
     const dataBrickColorNodes = dataBrickColorNode.join();
     const adfColorNodes = adfColorNode.join();
     // let dataBrickColorNodes = colorNodes.dataBrickColorNodes.join();
     // console.log('failed', failedLink);
     activitiesString = activitiesString.concat(`\nclassDef someclass fill:#f96;\nlinkStyle default stroke-width:2px,fill:none,stroke:orangered;\nclassDef default fill:#f3f2f1,stroke:#FFF,stroke-width:1px,color:black;`);
     if (!_isEmpty(failedLink)) {
         activitiesString = activitiesString.concat(`\nlinkStyle ${redLink} stroke-width:2px,fill:none,stroke:red;`);
     }
     // if (!_isEmpty(childNode)) {
     //     activitiesString = activitiesString.concat(`\nclassDef manualcolor fill:#f3f2f1,
     // stroke:#FFF,stroke-width:1px,color:black;\nclass ${children} manualcolor;`);
     // }
     console.log('adf', adfColorNodes, dataBrickColorNodes);
     if (!_isEmpty(adfColorNode)) {
         activitiesString = activitiesString.concat(`\nclassDef manualcoloradf fill:#f3f2f1,stroke:#FFF,stroke-width:1px,color:black;\nclass ${adfColorNodes} manualcoloradf;`);
     }
     if (!_isEmpty(dataBrickColorNode)) {
         activitiesString = activitiesString.concat(`\nclassDef manualcolordatabrick  fill:#d0eff7,stroke:#FFF,stroke-width:1px,color:black;\nclass ${dataBrickColorNodes} manualcolordatabrick;`);
     }
     return activitiesString;
 
 };
 
 export {
     mapGraphReq,
     mapGraphDefinitions
 };
 