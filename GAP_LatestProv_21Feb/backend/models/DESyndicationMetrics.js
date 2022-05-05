const mongoose = require('mongoose')

const { CONSTANTS } = require('../helpers/constant');

const { get: _get } = require('lodash');
const { date } = require('azure-storage');



const DESyndicationMetricsSchema = mongoose.Schema({

    _id: { type: String },

    attribute: { type: String },

    brand: { type: String },

    decile: { type: Number },

    insert_dt: { type: date },

    model: { type: String },

    percentage_difference: { type: Number },

    threshold: { type: Number },

    value: { type: Number }

});
const DESyndicationMetricsStorage = mongoose.model('Syndication_Check', DESyndicationMetricsSchema, _get(CONSTANTS, 'collectionName.Syndication_Check'));



const DESyndicationMetricsFindOne = getFields => DESyndicationMetricsStorage.findOne(getFields);

const DESyndicationMetricsFind = (getFields) => DESyndicationMetricsStorage.find(getFields).sort({insert_dt : -1}).limit(20);

const DESyndicationMetricsAggregation = (query) => DESyndicationMetricsStorage.aggregate(query);

const DESyndicationMetricsAttrDistinct = (field,getFields) => DESyndicationMetricsStorage.distinct(field,getFields);

const DESyndicationMetricsLocDistinct = (field,getFields) => DESyndicationMetricsStorage.distinct(field,getFields);

const DESyndicationMetricsBrandDistinct = (field,getFields) => DESyndicationMetricsStorage.distinct(field,getFields);

module.exports = {

    DESyndicationMetricsFindOne,

    DESyndicationMetricsFind,

    DESyndicationMetricsAggregation,

    DESyndicationMetricsAttrDistinct,

    DESyndicationMetricsLocDistinct,

    DESyndicationMetricsBrandDistinct

};