const mongoose = require('mongoose')

const { CONSTANTS } = require('../helpers/constant');

const { get: _get } = require('lodash');



const DEMetricsAdminSchema = mongoose.Schema({

    _id: { type: String },

    pipelineRunId: { type: String },

    model: { type: String },

    pipelineRunId: { type: String },

    brand: { type: String },

    source_name: { type: String },

    sink_name: { type: String },

    source_count: { type: Number },

    sink_count: { type: Number },

    percentage_difference: { type: Number },
    insert_dt: { type: Date },
    error_flag: { type: Boolean },


});
const DEMetricsAdminStorage = mongoose.model('DataEngMetrics', DEMetricsAdminSchema, _get(CONSTANTS, 'collectionName.DataEngMetrics'));



const DEMetricsAdminFindOne = getFields => DEMetricsAdminStorage.findOne(getFields).sort({insert_dt:-1});

const DEMetricsAdminFind = (getFields) => DEMetricsAdminStorage.find(getFields);



const DEMetricsAdminAggregation = (query) => DEMetricsAdminStorage.aggregate(query);



module.exports = {

    DEMetricsAdminFindOne,

    DEMetricsAdminFind,

    DEMetricsAdminAggregation,

};