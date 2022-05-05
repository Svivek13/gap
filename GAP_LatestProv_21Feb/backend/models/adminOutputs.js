
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');
const { dateTimeConversion } = require('../helpers/commonUtils');

const adminOutputSchema = mongoose.Schema({
   type: { type: String, required: true },
   properties: {  type: mongoose.Schema.Types.Mixed },
   
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
   createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
   modifiedBy: { type: mongoose.Schema.Types.ObjectId } 
});

const adminOutputStorage = mongoose.model('adminOutputs', adminOutputSchema, _get(CONSTANTS, 'collectionName.adminOutputs'));

const adminOutputsFindOne = getFields => adminOutputStorage.findOne(getFields);
const adminOutputsFind = (getFields) => adminOutputStorage.find(getFields);
// const saveProject = ({ data }) => ProjectStorage.create(data);
// const updateProject = ({ query, data }) => ProjectStorage.update(query, data);
// const findProjectUsingQuery = (query) => ProjectStorage.find(query);
// const projectAggregation = (query) => ProjectStorage.aggregate(query);

module.exports = {
    adminOutputsFindOne,
    adminOutputsFind,
    // saveProject,
    // updateProject,
    // findProjectUsingQuery,
    // projectAggregation,
};
