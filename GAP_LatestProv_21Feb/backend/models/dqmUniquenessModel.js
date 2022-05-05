
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');
const dqmUniquenessSchema = {
    _id: { type: mongoose.Schema.Types.ObjectId  },
    model:{ type: String },
    table:{ type: String },
    listOfAttributes:{ type: mongoose.Schema.Types.Mixed},
    uniquenessScore:{ type: Number},
    insert_dt:{type:Date}
  
}

const dqmUniquenessGapStorage = mongoose.model('DQ_Uniqueness_Modified', dqmUniquenessSchema, _get(CONSTANTS, 'collectionName.DQ_Uniqueness_Modified'));

// const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const dqmUniquenessFind_GAP = getFields => dqmUniquenessGapStorage.find(getFields).sort({uniquenessScore:-1});
const dqmUniquenessFind_GAPWithOptions = ({ query }) => dqmUniquenessGapStorage.find(query);
const dqmUniquenessFind_GAPOne = getFields => dqmUniquenessGapStorage.findOne(getFields);

// const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);




module.exports = {
    dqmUniquenessFind_GAP,
    dqmUniquenessFind_GAPWithOptions,
    dqmUniquenessFind_GAPOne,
    
};
