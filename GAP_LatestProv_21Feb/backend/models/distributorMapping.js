
const mongoose = require('mongoose')

const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const distributionMappingSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    Country: {type: Number},
    Country_Name: { type: String },
    Distributor_ID: { type: Number },
    Distributor_ID_Name: { type: String }


});


const DistributionMappingStorage = mongoose.model('distributionMapping', distributionMappingSchema, _get(CONSTANTS, 'collectionName.distributorMapping'));



// const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const distributionMappingFind = getFields => DistributionMappingStorage.find(getFields);
const distributionMappingFindOne = getFields => DistributionMappingStorage.findOne(getFields);
// const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);




module.exports = {
    distributionMappingFind,
    distributionMappingFindOne,
};
