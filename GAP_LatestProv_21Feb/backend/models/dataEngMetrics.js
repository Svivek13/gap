
const mongoose = require('mongoose')

const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const dataEngineerMetricSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    pipelineRunId: { type: String },
    row_counts: { type: [{ type:  mongoose.Schema.Types.Mixed }], default: undefined},
    index_counts: { type: [{ type:  mongoose.Schema.Types.Mixed }], default: undefined},

});


const DataEngineerMetricStorage = mongoose.model('dataEngineerMetrics', dataEngineerMetricSchema, _get(CONSTANTS, 'collectionName.dataEngineerMetric'));



const dataEngineerMetricFindOne = getFields => DataEngineerMetricStorage.findOne(getFields);
const dataEngineerMetricFind = getFields => DataEngineerMetricStorage.find(getFields);
const dataEngineerMetricAggregate = query => DataEngineerMetricStorage.aggregate(query);
const latestDataEngineerMetrcFind = query => DataEngineerMetricStorage.find(query).sort({ datetime: -1 }).limit(1);
const dataEngineerMetricFindOptions = ({ query, field, options }) => DataEngineerMetricStorage.find(query, field, options);




module.exports = {
    dataEngineerMetricFindOne,
    dataEngineerMetricFind,
    dataEngineerMetricAggregate,
    latestDataEngineerMetrcFind,
    dataEngineerMetricFindOptions,
};
