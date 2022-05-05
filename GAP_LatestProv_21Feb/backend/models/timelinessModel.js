
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');
const timelinessSchema = {
    _id: { type: mongoose.Schema.Types.ObjectId  },
    model:{ type: String },
    table_name:{ type: String },
    status:{type:String},
    schedule: {type:String},
    LastUpdatedOn:{type:Date},
    insert_dt:{type:Date}
    
}

const timelinessGapStorage = mongoose.model('DQ_Timeliness', timelinessSchema, _get(CONSTANTS, 'collectionName.DQ_Timeliness'));

// const filedMetricFindOne = getFields => FiledMetricStorage.findOne(getFields);
const timelinessFind_GAP = getFields => timelinessGapStorage.find(getFields);
const timelinessFind_GAPWithOptions = ({ query, field, options }) => timelinessGapStorage.find(query, field, options);
const timelinessFind_GAPOne = getFields => timelinessGapStorage.findOne(getFields);

// const filedMetricAggregate = query => FiledMetricStorage.aggregate(query);




module.exports = {
    timelinessFind_GAP,
    timelinessFind_GAPWithOptions,
    timelinessFind_GAPOne,
    
};
