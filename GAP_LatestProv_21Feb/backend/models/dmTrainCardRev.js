
const mongoose = require('mongoose')

const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const dmTrainCardRevSchema = mongoose.Schema({
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


const dmTrainCardRevStorage = mongoose.model('DM_train_card_rev', dmTrainCardRevSchema, _get(CONSTANTS, 'collectionName.DM_train_card_rev'));



// const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const dmTrainCardRevFind = getFields => dmTrainCardRevStorage.find(getFields);
const dmTrainCardRevFindWithOptions = ({ query, field, options }) => dmTrainCardRevStorage.find(query, field, options);
// const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);




module.exports = {
    dmTrainCardRevFind,
    dmTrainCardRevFindWithOptions
    
};
