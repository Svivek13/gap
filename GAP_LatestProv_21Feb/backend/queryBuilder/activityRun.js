const { cleanEntityData } = require('../helpers/commonUtils');
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const getActivityQuery = ({ data }) => cleanEntityData({
    pipelineRunId: _get(data, 'runId')
});

const activityQueryForPipeline = ({ data }) => {
    return cleanEntityData({
        projectId: _get(data, '_id')
    });
    // const matchQuery = cleanEntityData({
    //     projectId: _get(data, '_id')
    // });
    // return [
    //     {
    //         $match: matchQuery
    //     },
    //     {
    //         $lookup:
    //         {
    //           from: `${_get(CONSTANTS, 'collectionName.pipelineRun')}`,
    //           localField: "DBJobId",
    //           foreignField: "DBJobId",
    //           as: "notebookPipelineRuns"
    //         }
    //     }
    // ]
}


module.exports = {
    getActivityQuery,
    activityQueryForPipeline,
};