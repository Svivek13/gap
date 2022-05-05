
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');


const supportTicketSchema = mongoose.Schema({
   subject: { type: String },
   query: { type: String },
   
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
   createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
   modifiedBy: { type: mongoose.Schema.Types.ObjectId },
   
});

const supportTicketStorage = mongoose.model('supportTicket', supportTicketSchema, _get(CONSTANTS, 'collectionName.supportTicket'));

// const BUMetricsAdminFindOne = getFields => faqStorage.findOne(getFields);
const supportTicketFind = (getFields) => supportTicketStorage.find(getFields);
const createSupportTicket = (data) => supportTicketStorage.create(data);

// const BUMetricsAdminAggregation = (query) => BUMetricsAdminStorage.aggregate(query);

module.exports = {
    // BUMetricsAdminFindOne,
    supportTicketFind,
    createSupportTicket
    
    // BUMetricsAdminAggregation,
};
