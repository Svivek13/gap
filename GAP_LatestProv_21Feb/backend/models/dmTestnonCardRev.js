
const mongoose = require('mongoose')

const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const dmTestnonCardRevSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    brand:{ type: String },
    card_type:{ type: String },
    model_type:{ type: String },
    days_first_pur:{ type: mongoose.Schema.Types.Mixed },
    days_last_pur:{ type: mongoose.Schema.Types.Mixed },
    div_shp:{ type: mongoose.Schema.Types.Mixed },
    items_abandoned_3mth:{ type: mongoose.Schema.Types.Mixed },
    plcb_txn_pct:{ type: mongoose.Schema.Types.Mixed },
    t_num_txns_12mo_sls_log:{ type: mongoose.Schema.Types.Mixed },
}); 


const dmTestnonCardRevStorage = mongoose.model('DM_test_noncard_rev', dmTestnonCardRevSchema, _get(CONSTANTS, 'collectionName.DM_test_noncard_rev'));



// const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const dmTestnonCardRevFind = getFields => dmTestnonCardRevStorage.find(getFields);
const dmTestnonCardRevFindWithOptions = ({ query, field, options }) => dmTestnonCardRevStorage.find(query, field, options);
// const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);




module.exports = {
    dmTestnonCardRevFind,
    dmTestnonCardRevFindWithOptions
    
};
