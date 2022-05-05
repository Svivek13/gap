
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const TrackingMetricsEventSchema = mongoose.Schema({
   eventId: { type: String },
   eventContent: { type: String },
});

const TrackingMetricsEventStorage = mongoose.model('TrackingMetricsEvent', TrackingMetricsEventSchema, _get(CONSTANTS, 'collectionName.trackingMetricsEvent'));

const TrackingMetricsEventFindOne = getFields => TrackingMetricsEventStorage.findOne(getFields);
const TrackingMetricsEventFind = (getFields) => TrackingMetricsEventStorage.find(getFields);
const saveTrackingMetricsEvent = ({ data }) => TrackingMetricsEventStorage.create(data);
const updateTrackingMetricsEvent = ({ query, data }) => TrackingMetricsEventStorage.update(query, data);
const findTrackingMetricsEventUsingQuery = (query) => TrackingMetricsEventStorage.find(query);
const TrackingMetricsEventAggregation = (query) => TrackingMetricsEventStorage.aggregate(query);
const insertTrackingMetricsEvent = ({ data }) => TrackingMetricsEventStorage.insertMany(data);

module.exports = {
    TrackingMetricsEventFindOne,
    TrackingMetricsEventFind,
    saveTrackingMetricsEvent,
    updateTrackingMetricsEvent,
    findTrackingMetricsEventUsingQuery,
    TrackingMetricsEventAggregation,
    insertTrackingMetricsEvent
};
