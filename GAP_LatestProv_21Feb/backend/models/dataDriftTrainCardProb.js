
const mongoose = require('mongoose')

const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const dataDriftTrainCardProbSchema = mongoose.Schema({
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


const dataDriftTrainCardProbStorage = mongoose.model('DM_train_card_prob', dataDriftTrainCardProbSchema, _get(CONSTANTS, 'collectionName.DM_train_card_prob'));



// const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const dataDriftTrainCardProbFind = getFields => dataDriftTrainCardProbStorage.find(getFields);
const dataDriftTrainCardProbFindWithOptions = ({ query, field, options }) => dataDriftTrainCardProbStorage.find(query, field, options);
// const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);




module.exports = {
    dataDriftTrainCardProbFind,
    dataDriftTrainCardProbFindWithOptions
    
};
