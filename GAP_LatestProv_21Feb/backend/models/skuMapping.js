
const mongoose = require('mongoose');

const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const skuMappingSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    Distributor_ID: { type: Number },
    Distributor_ID_Name: { type: String },
    SKU_Product: { type: Number},
    SKU_Product_Name: { type: String }

});




const SKUMappingStorage = mongoose.model('skuMapping', skuMappingSchema, _get(CONSTANTS, 'collectionName.skuMapping'));



// const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const skuMappingFind = getFields => SKUMappingStorage.find(getFields);
const skuMappingFindOne = getFields => SKUMappingStorage.findOne(getFields);
// const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);




module.exports = {
    skuMappingFind,
    skuMappingFindOne,
    
};
