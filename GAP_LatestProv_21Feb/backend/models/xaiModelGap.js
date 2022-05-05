const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const xaiDataSchema = mongoose.Schema({
    _id: { type: String },

    model: { type: String },

    brand: { type: String },

    week_id: { type: Date },

    card_type: { type: String },

    model_type: {type : String},

    XAI: { type: mongoose.Schema.Types.Mixed }

});

const xaiDataStorage = mongoose.model('explainableAI', xaiDataSchema, _get(CONSTANTS, 'collectionName.explainableAI'));

const xaiDataFindOne = getFields => xaiDataStorage.findOne(getFields);
const xaiDataFind = (getFields) => xaiDataStorage.find(getFields);
const xaiDataAggregation = (query) => xaiDataStorage.aggregate(query);
const xaiDataDistinct = (field,getFields) => xaiDataStorage.distinct(field,getFields);
const xaiDataLocationDistinct = (field,getFields) => xaiDataStorage.distinct(field,getFields);
module.exports = {
    xaiDataFindOne,
    xaiDataFind,
    xaiDataAggregation,
    xaiDataDistinct,
    xaiDataLocationDistinct
};
