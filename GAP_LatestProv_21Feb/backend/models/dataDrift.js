
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const dataDriftMetricSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    Country: { type: String },
    EAN: { type: String },
    Sold_To: { type: String },
    Overall_Drift: { type: Number },
    Base_Price: { type: Number },
    Mean_diff_Base_Price: { type: Number },
    Median_diff_Base_Price: { type: Number },
    flag_Base_Price: { type: Number },
    Boxcox_Base_Price: { type: Number },
    Mean_diff_Boxcox_Base_Price: { type: Number },
    Median_diff_Boxcox_Base_Price: { type: Number },
    flag_Boxcox_Base_Price: { type: Number },
    Boxcox_Promoted_Price: { type: Number },
    Mean_diff_Boxcox_Promoted_Price: { type: Number },
    Median_diff_Boxcox_Promoted_Price: { type: Number },
    flag_Boxcox_Promoted_Price: { type: Number },
    Boxcox_Total_promo_spend: { type: Number },
    Mean_diff_Boxcox_Total_promo_spend: { type: Number },
    Median_diff_Boxcox_Total_promo_spend: { type: Number },
    flag_Boxcox_Total_promo_spend: { type: Number },
    Boxcox_Duration: { type: Number },
    Mean_diff_Boxcox_Duration: { type: Number },
    Median_diff_Boxcox_Duration: { type: Number },
    flag_Boxcox_Duration: { type: Number },
    // Log_sales_cases
    // Mean_diff_Log_sales_cases
    // Median_diff_Log_sales_cases
    Promoted_Price: { type: Number },
    Mean_diff_Promoted_Price: { type: Number },
    Median_diff_Promoted_Price: { type: Number },
    flag_Promoted_Price: { type: Number },
    Total_promo_spend: { type: Number },
    Mean_diff_Total_promo_spend: { type: Number },
    Median_diff_Total_promo_spend: { type: Number },
    flag_Total_promo_spend: { type: Number },
    Duration: { type: Number },
    // Sales_Cases
    // Mean_diff_Sales_Cases
    // Median_diff_Sales_Cases

    Mean_diff_Duration: { type: Number },
    Median_diff_Duration: { type: Number },
    flag_Duration: { type: Number },


    datetime: { type: Date },
    pipelineRunId: { type: String },

 
});


const DataDriftMetricStorage = mongoose.model('dataDriftMetric', dataDriftMetricSchema, _get(CONSTANTS, 'collectionName.dataDrift'));



// const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const dataDriftMetricFind = getFields => DataDriftMetricStorage.find(getFields).sort({ datetime: -1 });
const dataDriftMetricFindWithOptions = ({ query, field, options }) => DataDriftMetricStorage.find(query, field, options);
const dataDriftMetricFindOne = getFields => DataDriftMetricStorage.findOne(getFields);

// const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);




module.exports = {
    dataDriftMetricFind,
    dataDriftMetricFindWithOptions,
    dataDriftMetricFindOne,
    
};
