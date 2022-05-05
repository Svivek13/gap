const { get: _get, map: _map, isEmpty: _isEmpty, find: _find } = require('lodash');
const { cleanEntityData } = require('../helpers/commonUtils');
const cryptoRandomString = require('crypto-random-string');
const { CONSTANTS } = require('../helpers/constant');
const { cleanData } = require('jquery');


const mapSelectedActivityError = ({ data }) => cleanEntityData({
    errorCode: _get(data, 'errorCode'),
    message: _get(data, 'message'),
    failureType: _get(data, 'failureType')
});

const mapActivities = ({ data, activity, parentNodeId, res, pipelineType, parentStatus, groupedActivity }) => {
    //  console.log("Before calculation: ",JSON.stringify(data));
    _map(data, d => {

        const availablePipelineType = pipelineType;

        const randomNodeId = cryptoRandomString({ length: 6 });
        const expandableFlag = !_isEmpty(_get(d, 'typeProperties.activities')) ? true : false;
        // // console.log(_get(selectedActivity, 'notebookPipelineRuns'), 'check');
        // const isExpandable = !_isEmpty(_get(d, 'typeProperties.activities')) || (!_isEmpty(_get(selectedActivity, 'DBJobId', '')) && !_isEmpty(_get(selectedActivity, 'notebookPipelineRuns', []))) ? true : false;
        const isExpandable = !_isEmpty(_get(d, 'typeProperties.activities')) ? true : false;
        const response = {
            nodeId: randomNodeId,
            parentNodeId: !_isEmpty(parentNodeId) ? parentNodeId : null,
            dependsOn: _map(_get(d, 'dependsOn'), dep => cleanEntityData({
                activity: _get(dep, 'activity'),
                dependencyConditions: _get(dep, 'dependencyConditions.[0]')
            })),
            name: _get(d, 'name'),
            type: _get(d, 'type'),
            logicalActivityType: _get(d, 'LogicalActivityType'),
            pipelineCategory: availablePipelineType ? availablePipelineType : _get(CONSTANTS, 'pipelineCategory.default'),
            // status: selectedActivity ? _get(selectedActivity, 'status') : null,
            status: _get(d, 'status'),
            // error: selectedActivity ? mapSelectedActivityError({ data: _get(selectedActivity, 'error') }) : null,
            output: cleanEntityData({
                // runPageUrl: _get(selectedActivity, 'output.runPageUrl'),
                runPageUrl: _get(d, 'output.runPageUrl'),
            }),
            // error: cleanEntityData({
            //     message: _get(d, 'error.message'),
            //     errorCode: _get(d, 'error.errorCode'),
            // }),
            error: _get(d, 'ERROR'),
            isExpanded: false,
            expandable: isExpandable,
            // dbJobId: !_isEmpty(_get(selectedActivity, 'DBJobId', '')) ? _get(selectedActivity, 'DBJobId'): null,

        };
        const cleanedData = cleanEntityData(response);
        res.push(cleanedData);
        if (expandableFlag) {
            res = mapActivities({ data: _get(d, 'typeProperties.activities'), activity, parentNodeId: randomNodeId, res, pipelineType, parentStatus: _get(cleanedData, 'status'), groupedActivity });
        }



    });
 //   console.log("response to send: ", JSON.stringify(res));
    return res;
};



const mapPipelineResponse = ({ data, activity, parentNodeId, groupedActivity }) => {
    const cleanDataforUI = [];
    const cleanDataforUI2 = [];
    (_map(data, d => {
        const responseData = {
            name: _get(d, 'project'),
            dependson: _get(d, 'dependson'),
            pipeline_id: _get(d, 'pipeline_id'),
            properties: cleanEntityData({
                // activities: _map(_get(data, 'properties.activities'), d => mapActivities(d, activity, null, [])),
                activities: mapActivities({ data: _get(d, 'properties.activities'), activity, parentNodeId, res: [], pipelineType: _get(d, 'type'), groupedActivity }),
            })
        }
        cleanDataforUI.push(cleanEntityData(responseData));

    }));
    var resdata = Object.values(
        cleanDataforUI.reduce((c, e) => {
            if (!c[e.pipeline_id]) c[e.pipeline_id] = e;
            return c;
        }, {})
    );

    for (let i = 0; i < resdata.length - 1; i++) {
        const resdata_first = resdata[i].properties.activities;
        let count = 1;
        console.log((resdata_first[resdata_first.length - count]).hasOwnProperty("parentNodeId"));
        if((resdata_first[resdata_first.length - count]).hasOwnProperty("parentNodeId")){
                console.log("Hi");
                count++;
            }
      
        const name = resdata_first[resdata_first.length - count].name;
     
        const addDependsOn = {
            dependsOn: [{
                activity: name,
                dependencyConditions: "C"
            }]
        }

        Object.assign(resdata[i + 1].properties.activities[0], addDependsOn);

    }

    const finalData = []
    for (let i = 0; i < resdata.length; i++) {
        for (let key in resdata[i].properties.activities) {
            finalData.push(resdata[i].properties.activities[key])
        }
    }
    (_map(resdata, d => {
        const responseDataFinal = {
            name: _get(d, 'name'),
            dependson: _get(d, 'dependson'),
            pipeline_id: _get(d, 'pipeline_id'),
            properties: cleanEntityData({
                // activities: _map(_get(data, 'properties.activities'), d => mapActivities(d, activity, null, [])),
                activities: finalData,
            })
        }
        cleanDataforUI2.push(cleanEntityData(responseDataFinal));

    }));
 //   console.log("Respond ggggg: ", JSON.stringify(cleanDataforUI2[0]));
    return cleanDataforUI2[0];
};

const mapPipelineDSDropdownQuery = () => {
    return {
        parent: true,
        ds: true
    }
}

module.exports = {
    mapPipelineResponse,
    mapPipelineDSDropdownQuery
}