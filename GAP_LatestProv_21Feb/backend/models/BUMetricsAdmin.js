
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');
const { dateTimeConversion } = require('../helpers/commonUtils');

const BUMetricsAdminSchema = mongoose.Schema({
   template: { type: String },
   projectId: { type: mongoose.Schema.Types.ObjectId },
   execId: { type: mongoose.Schema.Types.ObjectId },
   metrics: {type: mongoose.Schema.Types.Mixed},
   
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
   createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
   modifiedBy: { type: mongoose.Schema.Types.ObjectId },
   
});

const BUMetricsAdminStorage = mongoose.model('BUMetrics', BUMetricsAdminSchema, _get(CONSTANTS, 'collectionName.buMetric'));

const BUMetricsAdminFindOne = getFields => BUMetricsAdminStorage.findOne(getFields);
const BUMetricsAdminFind = (getFields) => BUMetricsAdminStorage.find(getFields);

const BUMetricsAdminAggregation = (query) => BUMetricsAdminStorage.aggregate(query);

module.exports = {
    BUMetricsAdminFindOne,
    BUMetricsAdminFind,
    
    BUMetricsAdminAggregation,
};
