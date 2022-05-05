
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');
const { dateTimeConversion } = require('../helpers/commonUtils');

const projectSchema = mongoose.Schema({
    name: { type: String, required: true },
    projectType: { type: String },
    description: { type: String },

    // modelType: {
    //         type: String,
    //         enum : CONSTANTS.permittedModelTypes,
    //     }, // this field and mode in explainability in projectExecution are same
    // modelFile: { type: String },
    // modelFile: { 
    //     url: { type: String },
    //     uploadDate: { type: Date, default: Date.now }
    // },
    // trainFiles: [{
    //     url: { type: String },
    //     uploadDate: { type: Date, default: Date.now }
    // }],
    // testFiles: [{
    //     url: { type: String },
    //     uploadDate: { type: Date, default: Date.now }
    // }],
    // trainFiles: [{ type: String }],
    // testFiles: [{ type: String }],
    runStart:  { type: Date },
    runEnd: { type: Date },
    status: { type: String, default: 'In Progress' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: String },
    model:{type:String},
    modifiedBy: { type: mongoose.Schema.Types.ObjectId } 
});

const ProjectStorage = mongoose.model('Projects', projectSchema, _get(CONSTANTS, 'collectionName.project'));

const projectFindOne = getFields => ProjectStorage.findOne(getFields);
const projectFind = (getFields) => ProjectStorage.find(getFields);
const saveProject = ({ data }) => ProjectStorage.create(data);
const updateProject = ({ query, data }) => ProjectStorage.update(query, data);
const findProjectUsingQuery = (query) => ProjectStorage.find(query);
const projectAggregation = (query) => ProjectStorage.aggregate(query);
const deleteProject = (query) => ProjectStorage.deleteOne(query);


module.exports = {
    projectFindOne,
    projectFind,
    saveProject,
    updateProject,
    findProjectUsingQuery,
    projectAggregation,
    deleteProject,
};
