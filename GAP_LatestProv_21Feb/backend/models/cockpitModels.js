
const mongoose = require('mongoose')

const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const cockpitSchema = mongoose.Schema({
    
    Name: {type: String },
    Triggered_By:{type: String },
    Job_status:{type: String },
    Overall_drift:{type: String },
    Overall_DQ:{type: String },
    Accuracy:{type: String },
    Duration:{type: String },
    View:{type: String },
    Graph:{type: String },
    dependent_on:{type: String }
}); 


const cockpitStorage = mongoose.model('ProjectMain', cockpitSchema, _get(CONSTANTS, 'collectionName.ProjectMain'));



// const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const cockpitFind = getFields => cockpitStorage.find(getFields);
const cockpitFindWithOptions = ({ query, field, options }) => cockpitStorage.find(query, field, options);
// const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);




module.exports = {
    cockpitFind,
    cockpitFindWithOptions
    
};
