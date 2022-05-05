
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');
const dataDriftGapSchema = {
    _id: { type: String },

    feature: { type: String },

    feature_drift: { type: Number },

    overall_drift: { type: Number },

    model: { type: String },

    brand: { type: String },

    location: { type: String },

    scoring_data_run_date: { type: Date },
    
    insert_dt : {type : Date}
}

const dataDriftGapGapStorage = mongoose.model('dataDrift', dataDriftGapSchema, _get(CONSTANTS, 'collectionName.dataDrift'));

// const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const dataDriftGapFind_GAP = getFields => dataDriftGapGapStorage.find(getFields);
const dataDriftGapFind_GAPWithOptions = ({ query, field, options }) => dataDriftGapGapStorage.find(query, field, options);
const dataDriftGapFind_GAPOne = getFields => dataDriftGapGapStorage.findOne(getFields);
const dataDriftGapDistinctBrand = (field,getFields) => dataDriftGapGapStorage.distinct(field,getFields);
const dataDriftGapDistinctLocation = (field,getFields) => dataDriftGapGapStorage.distinct(field,getFields);
// const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);




module.exports = {
    dataDriftGapFind_GAP,
    dataDriftGapFind_GAPWithOptions,
    dataDriftGapFind_GAPOne,
    dataDriftGapDistinctBrand,
    dataDriftGapDistinctLocation    
};
