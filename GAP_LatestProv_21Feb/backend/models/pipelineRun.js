
const mongoose = require('mongoose')

const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const pipelineRunsSchema = mongoose.Schema({
    _id: { type: String },
    annotations: { type: [{ type: mongoose.Schema.Types.ObjectId }], default: undefined },
    debugRunId: { type: String },
    durationInMs: { type: Number, rquired: true },
    id: { type: String},
    invokedBy: {
        id: { type: String },
        name: { type: String, required: true },
        invokedByType: { type: String }
    },
    isLatest: { type: Boolean },
    lastUpdated: { type: Date },
    message: { type: String, required: true },
    parameters: { type: String },
    pipelineName: { type: String, required: true },
    runDimension: { type: mongoose.Schema.Types.Mixed },
    runEnd: { type: Date, required: true },
    runGroupId: { type: String },
    runId: { type: String, required: true },
    runStart: { type: Date, required: true },
    status: { type: String, required: true },
    pipelineId: { type: String },
    DBJobId: { type: String },
    metrics: {type: mongoose.Schema.Types.Mixed},
    child_pipeline_details: {type: mongoose.Schema.Types.Mixed}
    

});


const PipelineRunsStorage = mongoose.model('PipelineRun', pipelineRunsSchema, _get(CONSTANTS, 'collectionName.pipelineRun'));


const pipelineRunsFind = getFields => PipelineRunsStorage.find(getFields).sort({runStart: -1});
const pipelineRunsFindOne = getFields => PipelineRunsStorage.findOne(getFields);
const pipelineRunAggregate = ({ query }) => PipelineRunsStorage.aggregate(query);



module.exports = {
    pipelineRunsFind,
    pipelineRunAggregate,
    pipelineRunsFindOne,
};
