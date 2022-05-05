
const mongoose = require('mongoose')

const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const dataDriftTestSchema = mongoose.Schema({
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


const DataDriftTestStorage = mongoose.model('dataDriftTest1', dataDriftTestSchema, _get(CONSTANTS, 'collectionName.dataDriftTest1'));



// const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const dataDriftTestFind = getFields => DataDriftTestStorage.find(getFields);
const dataDriftTestFindWithOptions = ({ query, field, options }) => DataDriftTestStorage.find(query, field, options);
// const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);




module.exports = {
    dataDriftTestFind,
    dataDriftTestFindWithOptions
    
};
