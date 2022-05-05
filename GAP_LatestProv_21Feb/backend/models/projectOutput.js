const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const projectOutputSchema = mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'projects' },
    execId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectExecutions' },
    drift_output: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' } 
 });
 
 const ProjectOutputStorage = mongoose.model('ProjectOutputs', projectOutputSchema, _get(CONSTANTS, 'collectionName.projectOutputs'));

 const projectOutputFindOne = getFields => ProjectOutputStorage.findOne(getFields);
 const projectOutputFind = (getFields) => ProjectOutputStorage.find(getFields);
 const saveProjectOutput = ({ data }) => ProjectOutputStorage.create(data);
 const updateProjectOutput = ({ query, data }) => ProjectOutputStorage.update(query, data);
 const findProjectOutputUsingQuery = (query) => ProjectOutputStorage.find(query);
 const projectOutputAggregation = (query) => ProjectOutputStorage.aggregate(query);
 const deleteProjectOutput = (query) => ProjectOutputStorage.deleteOne(query);
 
 module.exports = {
    projectOutputFindOne,
    projectOutputFind,
    saveProjectOutput,
    updateProjectOutput,
    findProjectOutputUsingQuery,
    projectOutputAggregation,
    deleteProjectOutput,
 };
 