const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const projectOutputAdminSchema = mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'projects' },
    execId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectExecutions' },
    drift_output: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
 });
 
 const ProjectOutputAdminStorage = mongoose.model('ProjectOutputsAdmin', projectOutputAdminSchema, _get(CONSTANTS, 'collectionName.projectOutputsAdmin'));

 const projectOutputAdminFindOne = getFields => ProjectOutputAdminStorage.findOne(getFields);
 const projectOutputAdminFind = (getFields) => ProjectOutputAdminStorage.find(getFields);
//  const saveProjectOutput = ({ data }) => ProjectOutputAdminStorage.create(data);
//  const updateProjectOutput = ({ query, data }) => ProjectOutputAdminStorage.update(query, data);
//  const findProjectOutputUsingQuery = (query) => ProjectOutputAdminStorage.find(query);
 const projectOutputAdminAggregation = (query) => ProjectOutputAdminStorage.aggregate(query);
 
 module.exports = {
    projectOutputAdminFindOne,
    projectOutputAdminFind,
    // saveProjectOutput,
    // updateProjectOutput,
    // findProjectOutputUsingQuery,
    projectOutputAdminAggregation,
 };
 