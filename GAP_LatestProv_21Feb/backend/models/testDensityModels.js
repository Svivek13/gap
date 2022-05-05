
const mongoose = require('mongoose')

const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const testDensitySchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    brand:{ type: String },
    location:{ type: String },
    model:{ type: String },
    brand_rollup:{ type: mongoose.Schema.Types.Mixed },
    ctry_cd:{ type: mongoose.Schema.Types.Mixed },
    new_division:{ type: mongoose.Schema.Types.Mixed },
    active_period_months:{ type: mongoose.Schema.Types.Mixed },
    avg_discount_percentage:{ type: mongoose.Schema.Types.Mixed },
    avg_items_per_transaction:{ type: mongoose.Schema.Types.Mixed },
    avg_net_sales_per_item:{ type: mongoose.Schema.Types.Mixed },
    avg_net_sales_per_transaction:{ type: mongoose.Schema.Types.Mixed },
    category:{ type: mongoose.Schema.Types.Mixed },
    count_distinct_departments:{ type: mongoose.Schema.Types.Mixed },
    count_transactions:{ type: mongoose.Schema.Types.Mixed },
    items_abandoned_1mth:{ type: mongoose.Schema.Types.Mixed },
    items_abandoned_3mth:{ type: mongoose.Schema.Types.Mixed },
    items_browsed_last_mth:{ type: mongoose.Schema.Types.Mixed },
    items_browsed_last_qtr:{ type: mongoose.Schema.Types.Mixed },
    items_purchased_first_quarter:{ type: mongoose.Schema.Types.Mixed },
    items_purchased_fourth_quarter:{ type: mongoose.Schema.Types.Mixed },
    items_purchased_last_month:{ type: mongoose.Schema.Types.Mixed },
    items_purchased_second_quarter:{ type: mongoose.Schema.Types.Mixed },
    items_purchased_third_quarter:{ type: mongoose.Schema.Types.Mixed },
    percent_department_shopped:{ type: mongoose.Schema.Types.Mixed },

    recency_purchase_weeks:{ type: mongoose.Schema.Types.Mixed },
    scoring_data_run_date:{ type: mongoose.Schema.Types.Mixed },
    total_items:{ type: mongoose.Schema.Types.Mixed },
    total_net_sales:{ type: mongoose.Schema.Types.Mixed },
}); 


const testDensityStorage = mongoose.model('dataDriftTest', testDensitySchema, _get(CONSTANTS, 'collectionName.dataDriftTest'));



// const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const testDensityFind = getFields => testDensityStorage.find(getFields);
const testDensityFindWithOptions = ({ query, field, options }) => testDensityStorage.find(query, field, options);
// const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);




module.exports = {
    testDensityFind,
    testDensityFindWithOptions
    
};
