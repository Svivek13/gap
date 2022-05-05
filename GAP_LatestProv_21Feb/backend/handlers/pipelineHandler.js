const { get: _get, groupBy: _groupBy, isEmpty: _isEmpty } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { pipelineFindOne } = require('../models/pipeline');
const { projectFindOne } = require('../models/project');
const { mapPipelineResponse } = require('../mappers/pipeline');
const { pipelineGraphQuery } = require('../queryBuilder/pipeline');
// const { pipelineRunQuery } = require('../queryBuilder/pipelineRun');
const { pipelineProjectQuery } = require('../queryBuilder/project');
const { activityQueryForPipeline } = require('../queryBuilder/activityRun');
// const { pipelineRunsFindOne } = require('../models/pipelineRun');
const { activityRunsFind, activityRunsAggregate } = require('../models/activityRun');
const { enrichArrDataToObj } = require('../helpers/commonUtils');
const { findActivityLastGroupedObj } = require('../mappers/activityRuns');

const {adminMetaDataFindOne } = require('../models/adminMetaData');
const { adminMetaDataProjectQuery } = require('../queryBuilder/adminMetaData');
const { projectAdminFindOne } = require('../models/projectsAdmin');

const {graphFindOne, graphAggregate} = require('../models/graph');
const { userFindOne } = require('../models/user');

const pipelineFlowchartHelper = async({ body }) => {
//     // const q = pipelineRunQuery({ data: body });
//     const q = adminMetaDataProjectQuery({ data: body });
//     // console.log(q);
//     // const projectDetail = await adminMetaDataFindOne(q);
//     const projectDetail = await projectAdminFindOne(q);
//     // console.log(projectDetail);
//     const query = pipelineGraphQuery({ data: projectDetail });
//     const activityQuery = activityQueryForPipeline({ data: projectDetail });
//     // console.log( query, activityQuery);
//     if (_isEmpty(query)) {
//         return { content: {}};
//     }
//     // const [pipeline, activity] = await Promise.all([
//     //     pipelineFindOne(query),
//     //     activityRunsFind({ getFields: { pipelineRunId: _get(pipelineRunDetail, '_id')}})
//     // ]);

//     const [pipeline, activity] = await Promise.all([
//         pipelineFindOne(query),
//         activityRunsFind({ query: activityQuery })
//     ]);

//     // console.log(JSON.stringify(pipeline));
//     const groupedActivity = _groupBy(activity, 'activityName');
//     const enrichedActivity = findActivityLastGroupedObj({ data: groupedActivity });
//     // console.log(JSON.stringify(groupedActivity));
//     // const enrichedActivity = enrichArrDataToObj({ data: activity, field: 'activityName'})
//     const response = mapPipelineResponse({ data: pipeline, activity: enrichedActivity, parentNodeId: null, groupedActivity, parentStatus: null });
//     return { content: response};
    //    console.log("Body",body);
        const userDetail = await userFindOne({ _id: _get(body, 'userId') });

        const projQuery = {
         createdBy: _get(userDetail, 'email'),
            // project: 'Example Project'
            project: _get(body, 'projectName'),
        };
        // console.log('project query', projQuery);
        // const projectData = await projectFind(query);
        const query = [
            {
                // pipelineid: "mainPipeline"
                // $match: { project: 'Example Project' },
                $match: projQuery
            },
            {
                $sort: { datetime: -1}
            }
        //    { $group: {
        //         _id: { dependson: "$dependson" },
        //      }}
        ];

        if (_isEmpty(query)) {
            return { content: {}};
        }

        // console.log("query to fetch: ",query);
        
        const [pipeline] = await Promise.all([
            graphAggregate(query)
            // activityRunsFind({ query: activityQuery })
        ]);
        // console.log('pipeline', JSON.stringify(pipeline));


        if (_isEmpty(pipeline)) {
            return { content: {}};
        }

        const response = mapPipelineResponse({ data: pipeline, activity: null, parentNodeId: null, groupedActivity: null, parentStatus: null });
        // console.log("Response after manipulation: ", JSON.stringify(response));
        return { content: response};
}

const pipelineFlowchartHandler = async options => baseHandler(pipelineFlowchartHelper, options);

const pipelineChildFlowchartHelper = async({ body }) => {

    const q = pipelineRunQuery({ data: body });
    const pipelineRunDetail = await pipelineRunsFindOne(q);
    const query = pipelineGraphQuery({ data: pipelineRunDetail });
    const activityQuery = activityQueryForPipeline({ pipelineRunDetail });
    console.log("first data:" , JSON.stringify(pipelineRunDetail), "Print Query data",query);
    if (_isEmpty(query)) {
        return { content: {}};
    }
    // const [pipeline, activity] = await Promise.all([
    //     pipelineFindOne(query),
    //     activityRunsFind({ getFields: { pipelineRunId: _get(pipelineRunDetail, '_id')}})
    // ]);

    const [pipeline, activity] = await Promise.all([
        pipelineFindOne(query),
        activityRunsAggregate({ query: activityQuery })
    ]);

    // console.log(JSON.stringify(pipeline));
    const groupedActivity = _groupBy(activity, 'activityName');
    // console.log('activity', groupedActivity);
    const enrichedActivity = findActivityLastGroupedObj({ data: groupedActivity });
    // const enrichedActivity = enrichArrDataToObj({ data: activity, field: 'activityName'})
    const response = mapPipelineResponse({ data: pipeline, activity: enrichedActivity, parentNodeId: _get(body, 'nodeId'), groupedActivity });
    return { content: response};

    

}

const pipelineChildFlowchartHandler = async options => baseHandler(pipelineChildFlowchartHelper, options);

module.exports = {
    pipelineFlowchartHandler,
    pipelineChildFlowchartHandler,
}
