const mongoose = require('mongoose')

const { CONSTANTS } = require('../helpers/constant');

const { get: _get } = require('lodash');



const DEMetricsDrillDownSchema = mongoose.Schema({

    _id: { type: mongoose.Schema.Types.ObjectId },

    pipelineRunId: { type: String },

    model: { type: String },

    brand: { type: String },

    source_name: { type: String },

    decile : {type:Number},

    sink_name: { type: String },

    source_count: { type: Number },

    sink_count: { type: Number },

    error_flag: { type: Boolean },

});
// const DEMetricsDrillDownStorage = mongoose.model('DataEnggMetrics', DEMetricsDrillDownSchema, _get(CONSTANTS, 'collectionName.DataEnggMetrics'));

const DEMetricsDrillDownStorage = mongoose.model('DataEngMetricsDrillDown', DEMetricsDrillDownSchema, _get(CONSTANTS, 'collectionName.DataEngMetricsDrillDown'));



const DEMetricsDrillDownFindOne = getFields => DEMetricsDrillDownStorage.findOne(getFields);

const DEMetricsDrillDownFind = (getFields) => DEMetricsDrillDownStorage.find(getFields);



const DEMetricsDrillDownAggregation = (query) => DEMetricsDrillDownStorage.aggregate(query);



module.exports = {

    DEMetricsDrillDownFindOne,

    DEMetricsDrillDownFind,

    DEMetricsDrillDownAggregation,

};