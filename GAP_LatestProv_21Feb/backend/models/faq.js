
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');
const { dateTimeConversion } = require('../helpers/commonUtils');

const faqSchema = mongoose.Schema({
   question: { type: String },
   answer: { type: String },
   
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
   createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
   modifiedBy: { type: mongoose.Schema.Types.ObjectId },
   
});

const faqStorage = mongoose.model('faq', faqSchema, _get(CONSTANTS, 'collectionName.faq'));

// const BUMetricsAdminFindOne = getFields => faqStorage.findOne(getFields);
const faqFind = (getFields) => faqStorage.find(getFields);

// const BUMetricsAdminAggregation = (query) => BUMetricsAdminStorage.aggregate(query);

module.exports = {
    // BUMetricsAdminFindOne,
    faqFind,
    
    // BUMetricsAdminAggregation,
};
