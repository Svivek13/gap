
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');
const dataDriftMetricSchema = {
    _id: { type: String },

    feature: { type: String },

    feature_drift: { type: Number },

    overall_drift: { type: Number },

    model: { type: String },

    brand: { type: String },

    model_type: { type: String },

    scoring_data_run_date: { type: Date },
    
    card_type : {type : String}
}

const DataDriftMetricGapStorage = mongoose.model('DM_drift_results', dataDriftMetricSchema, _get(CONSTANTS, 'collectionName.DM_drift_results'));

// const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const dataDriftMetricFind_GAP = getFields => DataDriftMetricGapStorage.find(getFields);
const dataDriftMetricFind_GAPWithOptions = ({ query, field, options }) => DataDriftMetricGapStorage.find(query, field, options);
const dataDriftMetricFind_GAPOne = getFields => DataDriftMetricGapStorage.findOne(getFields);
const dataDMDriftGapDistinctBrand = (field,getFields) => DataDriftMetricGapStorage.distinct(field,getFields);
const dataDMDriftGapDistinctLocation = (field,getFields) => DataDriftMetricGapStorage.distinct(field,getFields);
// const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);

module.exports = {
    dataDriftMetricFind_GAP,
    dataDriftMetricFind_GAPWithOptions,
    dataDriftMetricFind_GAPOne,
    dataDMDriftGapDistinctBrand,
    dataDMDriftGapDistinctLocation
};
