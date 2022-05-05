
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');
const { dateTimeConversion } = require('../helpers/commonUtils');

const MetaDataSchema = mongoose.Schema({
   type: { type: String, required: true },
   properties: {  type: mongoose.Schema.Types.Mixed },
   
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
   createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
   modifiedBy: { type: mongoose.Schema.Types.ObjectId } 
});

const MetaDataStorage = mongoose.model('metadatas', MetaDataSchema, _get(CONSTANTS, 'collectionName.metadata'));

const metaDataFindOne = getFields => MetaDataStorage.findOne(getFields);
const metaDataFind = (getFields) => MetaDataStorage.find(getFields);
// const saveProject = ({ data }) => ProjectStorage.create(data);
// const updateProject = ({ query, data }) => ProjectStorage.update(query, data);
// const findProjectUsingQuery = (query) => ProjectStorage.find(query);
const metaDataAggregation = (query) => MetaDataStorage.aggregate(query);

module.exports = {
    metaDataFindOne,
    metaDataFind,
    // saveProject,
    // updateProject,
    // findProjectUsingQuery,
    metaDataAggregation,
};
