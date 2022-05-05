
const mongoose = require('mongoose')
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const trackingMetricsSchema = mongoose.Schema({
   sessionId: { type: String },
   username: { type: String },
   userId: { type: mongoose.Schema.Types.ObjectId },
   userMail: { 
    type: String,
    validate: {
     validator: function(email) {
         var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
         return re.test(email)
     },
     message: props => `${props.value} is not a valid emali address!`
     },
    },
   screenName: { type: String },
   eventType: { type: String },
   descriptionId: { type: String },
   value: { type: String },
   timestamp: { type: Date },
});

const TrackingMetricscStorage = mongoose.model('TrackingMetrics', trackingMetricsSchema, _get(CONSTANTS, 'collectionName.trackingMetrics'));

const trackingMetricsFindOne = getFields => TrackingMetricscStorage.findOne(getFields);
const trackingMetricsFind = (getFields) => TrackingMetricscStorage.find(getFields);
const saveTrackingMetrics = ({ data }) => TrackingMetricscStorage.create(data);
const updateTrackingMetrics = ({ query, data }) => TrackingMetricscStorage.update(query, data);
const findTrackingMetricsUsingQuery = (query) => TrackingMetricscStorage.find(query);
const TrackingMetricsAggregation = (query) => TrackingMetricscStorage.aggregate(query);

module.exports = {
    trackingMetricsFindOne,
    trackingMetricsFind,
    saveTrackingMetrics,
    updateTrackingMetrics,
    findTrackingMetricsUsingQuery,
    TrackingMetricsAggregation,
};
