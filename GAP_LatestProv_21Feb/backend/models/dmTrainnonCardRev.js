
const mongoose = require('mongoose')

const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const dmTrainnonCardRevSchema = mongoose.Schema({
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


const dmTrainnonCardRevStorage = mongoose.model('DM_train_noncard_rev', dmTrainnonCardRevSchema, _get(CONSTANTS, 'collectionName.DM_train_noncard_rev'));



// const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const dmTrainnonCardRevFind = getFields => dmTrainnonCardRevStorage.find(getFields);
const dmTrainnonCardRevFindWithOptions = ({ query, field, options }) => dmTrainnonCardRevStorage.find(query, field, options);
// const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);




module.exports = {
    dmTrainnonCardRevFind,
    dmTrainnonCardRevFindWithOptions
    
};
