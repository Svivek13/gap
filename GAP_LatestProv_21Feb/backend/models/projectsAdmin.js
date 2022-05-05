
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');
const { dateTimeConversion } = require('../helpers/commonUtils');

const projectAdminSchema = mongoose.Schema({
   name: { type: String, required: true },
   projectType: { type: String, enum: CONSTANTS.permittedProjectTypes, default: 'non-admin' },
   description: { type: String },
   modelType: {
        type: String,
        enum : CONSTANTS.permittedModelTypes,
    }, // this field and mode in explainability in projectExecution are same
    // modelFile: { type: String },
    modelFile: { 
        url: { type: String },
        uploadDate: { type: Date, default: Date.now }
    },
    trainFiles: [{
        url: { type: String },
        uploadDate: { type: Date, default: Date.now }
    }],
    testFiles: [{
        url: { type: String },
        uploadDate: { type: Date, default: Date.now }
    }],
    // trainFiles: [{ type: String }],
    // testFiles: [{ type: String }],
    status: { type: String, default: 'In Progress' },
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
   createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
   modifiedBy: { type: mongoose.Schema.Types.ObjectId },
   pipelineId: { type: String },
   model : {type:String}
});

const ProjectAdminStorage = mongoose.model('ProjectsAdmin', projectAdminSchema, _get(CONSTANTS, 'collectionName.projectsAdmin'));

const projectAdminFindOne = getFields => ProjectAdminStorage.findOne(getFields);
const projectAdminFind = (getFields) => ProjectAdminStorage.find(getFields);
// const saveProject = ({ data }) => ProjectAdminStorage.create(data);
// const updateProject = ({ query, data }) => ProjectAdminStorage.update(query, data);
// const findProjectUsingQuery = (query) => ProjectAdminStorage.find(query);
const projectAdminAggregation = (query) => ProjectAdminStorage.aggregate(query);

module.exports = {
    projectAdminFindOne,
    projectAdminFind,
    // saveProject,
    // updateProject,
    // findProjectUsingQuery,
    projectAdminAggregation,
};
