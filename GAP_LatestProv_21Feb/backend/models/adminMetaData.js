
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');
const { dateTimeConversion } = require('../helpers/commonUtils');

const adminMetaDataSchema = mongoose.Schema({
   type: { type: String, required: true },
   properties: {  type: mongoose.Schema.Types.Mixed },
   
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
   createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
   modifiedBy: { type: mongoose.Schema.Types.ObjectId } 
});

const adminMetaDataStorage = mongoose.model('adminMetaData', adminMetaDataSchema, _get(CONSTANTS, 'collectionName.adminMetaData'));

const adminMetaDataFindOne = getFields => adminMetaDataStorage.findOne(getFields);
const adminMetaDataFind = (getFields) => adminMetaDataStorage.find(getFields);
// const saveProject = ({ data }) => ProjectStorage.create(data);
// const updateProject = ({ query, data }) => ProjectStorage.update(query, data);
// const findProjectUsingQuery = (query) => ProjectStorage.find(query);
const adminMetaDataAggregation = (query) => adminMetaDataStorage.aggregate(query);

module.exports = {
    adminMetaDataFindOne,
    adminMetaDataFind,
    // saveProject,
    // updateProject,
    // findProjectUsingQuery,
    adminMetaDataAggregation,
};
