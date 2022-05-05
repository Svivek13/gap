
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const activityRunsSchema = mongoose.Schema({
    _id: { type: String },
    activityName: { type: String, required: true },
    activityRunEnd: { type: Date },
    // activityRunId: { type: String, required: true },
    activityRunStart: { type: Date, required: true },
    activityType: { type: String },
    durationInMs: { type: Number },
    error: {
        errorCode: { type: String, required: true },
        message: { type: String, required: true },
        failureType: { type: String },
        target: { type: String },
        details: { type: String },
    },
    executionDetails: { type: mongoose.Schema.Types.Mixed },
    id: { type: String },
    input: { type: mongoose.Schema.Types.Mixed },
    // integrationRuntimeNames: { type: [{ type: mongoose.Schema.Types.ObjectId }], default: undefined },
    // iterationHash: { type: String },
    // linkedServiceName: { type: String },
    output: { type: mongoose.Schema.Types.Mixed },
    pipelineName: { type: String, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId },
    // recoveryStatus: { type: String },
    // retryAttempt: { type: mongoose.Schema.Types.Mixed },
    status: { type: String, required: true },
    // userProperties: { type: mongoose.Schema.Types.Mixed },
    // function_name: { type: String, required: true},
    // DBJobId: { type: String },

});


const ActivityRunsStorage = mongoose.model('ActivityRun', activityRunsSchema, _get(CONSTANTS, 'collectionName.activityRuns'));


// const activityRunsFind = ({ getFields }) => ActivityRunsStorage.find(getFields).sort({activityRunStart: 1});
const activityRunsFind = ({ getFields }) => ActivityRunsStorage.find(getFields);
const activityRunsAggregate = ({ query }) => ActivityRunsStorage.aggregate(query);


module.exports = {
    activityRunsFind,
    activityRunsAggregate
};
