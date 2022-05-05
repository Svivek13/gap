
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const countryMappingSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    Country_name: { type: String },
    Country_code: { type: Number }

});


const CountryMappingStorage = mongoose.model('countryMapping', countryMappingSchema, _get(CONSTANTS, 'collectionName.countryMapping'));



// const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const countryMappingFind = getFields => CountryMappingStorage.find(getFields);
const countryMappingFindOne = getFields => CountryMappingStorage.findOne(getFields);
// const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);




module.exports = {
    countryMappingFind,
    countryMappingFindOne,
    
};
