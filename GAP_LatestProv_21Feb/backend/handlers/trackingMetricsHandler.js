const { baseHandler } = require('../private/base-handler');
const { mapTMData, mapTMDescData } = require('../mappers/trackingMetrics');
const { saveTrackingMetrics } = require('../models/trackingMetrics');
const { insertTrackingMetricsDesc } = require('../models/trackingMetricsDesc');
const { insertTrackingMetricsEvent } = require('../models/trackingMetricsEvent');

const EventTrackingHelper = async({ body }) => {
    const TMData = mapTMData({ data: body })
    const eventResponse = await saveTrackingMetrics({ data: TMData });
    return { content: eventResponse };
};
const eventTrackingHandler = async options => baseHandler(EventTrackingHelper, options);

const descHelper = async({ body }) => {
    // const TMDescData = mapTMDescData({ data: body })
    const eventResponse = await insertTrackingMetricsDesc({ data: body });
    return { content: eventResponse };
};
const descHandler = async options => baseHandler(descHelper, options);

const tmEventsHelper = async({ body }) => {
    // const TMDescData = mapTMDescData({ data: body })
    const eventResponse = await insertTrackingMetricsEvent({ data: body });
    return { content: eventResponse };
};
const tmEventsHandler = async options => baseHandler(tmEventsHelper, options);

module.exports = {
    eventTrackingHandler,
    descHandler,
    tmEventsHandler
}