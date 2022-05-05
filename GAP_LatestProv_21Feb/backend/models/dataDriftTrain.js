
const mongoose = require('mongoose')

const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const dataDriftTrainSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    country: { type: Number },
    EAN: { type: Number },
    Sold_To: { type: Number },
    datetime: { type: Date },
    pipelineRunId: { type: String },
    Base_Price: { type: Number },
    Boxcox_Base_Price: { type: Number },
    Boxcox_Promoted_Price: { type: Number },
    Boxcox_Total_promo_spend: { type: Number },
    Total_promo_spend: { type: Number },
    Promoted_Price: { type: Number },
    index: { type: Number },
    Unnamed: { type: Number },
    Log_sales_cases: { type: Number },
    Sales_organization_ID: { type: Number },
    Date: { type: Date },
    Sales_Cases: { type: Number },
    Duration: { type: Number }
 
}); 


const DataDriftTrainStorage = mongoose.model('dataDriftTrain1', dataDriftTrainSchema, _get(CONSTANTS, 'collectionName.dataDriftTrain1'));



// const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const dataDriftTrainFind = getFields => DataDriftTrainStorage.find(getFields);
const dataDriftTrainFindWithOptions = ({ query, field, options }) => DataDriftTrainStorage.find(query, field, options);
const dataDriftTrainFindOne = getFields => DataDriftTrainStorage.findOne(getFields);
// const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);




module.exports = {
    dataDriftTrainFind,
    dataDriftTrainFindWithOptions,
    dataDriftTrainFindOne,
    
};
