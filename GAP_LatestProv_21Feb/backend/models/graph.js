
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');
const { dateTimeConversion } = require('../helpers/commonUtils');

const graphSchema = mongoose.Schema({
   pipelineid: { type: String },
   dependsOn : {type: String},
   datetime: { type: Date },
   project: { type: String },
   properties: { type: mongoose.Schema.Types.Mixed},
   createdBy: { type: String },
   
});

const graphStorage = mongoose.model('graph_poc', graphSchema, _get(CONSTANTS, 'collectionName.graph_poc'));

const graphFindOne = getFields => graphStorage.findOne(getFields);
const graphFind = (getFields) => graphStorage.find(getFields);
const graphAggregate = (query) => graphStorage.aggregate(query);

// const BUMetricsAdminAggregation = (query) => BUMetricsAdminStorage.aggregate(query);

module.exports = {
    // BUMetricsAdminFindOne,
    graphFind,
    graphFindOne,
    graphAggregate,
    
    // BUMetricsAdminAggregation,
};
