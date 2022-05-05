
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');
const dqmCompletenessSchema = {
    _id: { type: mongoose.Schema.Types.ObjectId  },
    model:{ type: String },
    table:{ type: String },
    listOfAttributes:{ type: mongoose.Schema.Types.Mixed},
    overallCompletenessScore:{ type: Number}

  
}

const dqmCompletenessGapStorage = mongoose.model('DQ_Completeness', dqmCompletenessSchema, _get(CONSTANTS, 'collectionName.DQ_Completeness'));

// const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const dqmCompletenessFind_GAP = getFields => dqmCompletenessGapStorage.find(getFields);
const dqmCompletenessFind_GAPWithOptions = ({ query, field, options }) => dqmCompletenessGapStorage.find(query, field, options);
const dqmCompletenessFind_GAPOne = getFields => dqmCompletenessGapStorage.findOne(getFields);

// const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);




module.exports = {
    dqmCompletenessFind_GAP,
    dqmCompletenessFind_GAPWithOptions,
    dqmCompletenessFind_GAPOne,
    
};
