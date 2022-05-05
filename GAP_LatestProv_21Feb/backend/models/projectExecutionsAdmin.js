
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');
const { dateTimeConversion } = require('../helpers/commonUtils');

const projectExecutionAdminSchema = mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'projects' },
    airflowRunId: { type: mongoose.Schema.Types.ObjectId },
    executionName: { type: String },
    modelFile: { type: String },
    trainFile: { type: String },
    testFile: { type: String },
    status: { type: String },
    // executionType: [{ type: String }],
    executionType: {
        type: [String], 
        enum: CONSTANTS.permittedExecutionTypes,
        required: "Please specify at least one execution type."
        // validate: v => Array.isArray(v) && v.length > 0,
    },
    driftexecutionTime: {
        airflowRunId: { type: mongoose.Schema.Types.ObjectId }, 
        start: { type: Date },
        end: { type: Date },
        status: { type: String } // ["Running","Success","Failed"]
    },
    xaiexecutionTime: {
        airflowRunId: { type: mongoose.Schema.Types.ObjectId },
        start: { type: Date },
        end: { type: Date },
        status: { type: String } // real-time ke liye separate field
    },
    driftStatus: { type: String }, // for future real-time update, discussion
    xaiStatus: { type: String }, // for future real-time update, discussion
    explainability: {
        mode: {
            type: String,
            enum : ['regression','classification', 'time-series'],
        }, // type of model, same as modelType in project model
        testDataTargetVars: {
            label: {type: String}, // target variable to take from headers
            classNames: { type: String }, // input box comma-separated
            categoricalFeatures: [{ type: String }], //coming from headers - multiselect dropdown
        },
        trainDataTargetVars: {
            label: {type: String}, // target variable to take from headers
            classNames: { type: String }, // input box comma-separated
            categoricalFeatures: [{ type: Number }], //coming from headers - multiselect dropdown | changed to Number from String because Sai needs indices, earlier was storing array of column names
        }
    },
    payloadParameters: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId },

});

const ProjectExecutionAdminStorage = mongoose.model('ProjectExecutionsAdmin', projectExecutionAdminSchema, _get(CONSTANTS, 'collectionName.projectExecutionsAdmin'));

const projectExecutionAdminFindOne = getFields => ProjectExecutionAdminStorage.findOne(getFields);
const projectExecutionAdminFind = getFields => ProjectExecutionAdminStorage.find(getFields);
// const saveProjectExecution = ({ data }) => ProjectExecutionAdminStorage.create(data);
// const updateProjectExecution = ({ query, data }) => ProjectExecutionAdminStorage.update(query, data);

module.exports = {
    projectExecutionAdminFindOne,
    projectExecutionAdminFind,
    // saveProjectExecution,
    // updateProjectExecution,
};
