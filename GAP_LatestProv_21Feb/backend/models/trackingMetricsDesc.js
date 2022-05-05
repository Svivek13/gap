
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const TrackingMetricsDescSchema = mongoose.Schema({
   descId: { type: String },
   descContent: { type: String },
});

const TrackingMetricsDescStorage = mongoose.model('TrackingMetricsDesc', TrackingMetricsDescSchema, _get(CONSTANTS, 'collectionName.trackingMetricsDesc'));

const TrackingMetricsDescFindOne = getFields => TrackingMetricsDescStorage.findOne(getFields);
const TrackingMetricsDescFind = (getFields) => TrackingMetricsDescStorage.find(getFields);
const saveTrackingMetricsDesc = ({ data }) => TrackingMetricsDescStorage.create(data);
const updateTrackingMetricsDesc = ({ query, data }) => TrackingMetricsDescStorage.update(query, data);
const findTrackingMetricsDescUsingQuery = (query) => TrackingMetricsDescStorage.find(query);
const TrackingMetricsDescAggregation = (query) => TrackingMetricsDescStorage.aggregate(query);
const insertTrackingMetricsDesc = ({ data }) => TrackingMetricsDescStorage.insertMany(data);

module.exports = {
    TrackingMetricsDescFindOne,
    TrackingMetricsDescFind,
    saveTrackingMetricsDesc,
    updateTrackingMetricsDesc,
    findTrackingMetricsDescUsingQuery,
    TrackingMetricsDescAggregation,
    insertTrackingMetricsDesc
};
