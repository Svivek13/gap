
const mongoose = require('mongoose')

const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const filedMetricSchema = mongoose.Schema({
    datetime: { type: Date },
    country: { type: String },
    dist: {type: String},
    sku: { type: String},
    MAPE: { type: Number },
    RMSE: { type: Number },
    RMSE_perc: { type: Number },
    Regressors_list: { type: mongoose.Schema.Types.Mixed },
    Regressors_list1: { type: mongoose.Schema.Types.Mixed },
    growth: { type: mongoose.Schema.Types.Mixed},
    seasonality_mode: { type: mongoose.Schema.Types.Mixed},
    Method: { type: mongoose.Schema.Types.Mixed},
    Regressors_flag: { type: mongoose.Schema.Types.Mixed},
    file_name: { type: String},
    
    CALENDER_YEAR_ac: { type: Number },
    CALENDER_MONTH_NUMBER_ac: { type: Number },
    baselinevsactual_ac: { type: Number },
    baselinevsactual_fm: { type: Number },

});


const FiledMetricStorage = mongoose.model('filedMetrics', filedMetricSchema, _get(CONSTANTS, 'collectionName.filedMetric'));



const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const filedMetricFind = getFields => FiledMetricStorage.find(getFields);
const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);
const latestFiledMetrcFind = query => FiledMetricStorage.find(query).sort({ datetime: -1 }).limit(1);
const filedMetricFindOptions = ({ query, field, options }) => FiledMetricStorage.find(query, field, options);




module.exports = {
    filedMetricFind,
    filedMetricFindOne,
    filedMetricAggregate,
    latestFiledMetrcFind,
    filedMetricFindOptions,
};
