
const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { segmentDensityFind,segmentDensityTrainSegmentFilter} = require('../models/dataDriftSegmentTrain');

const segmentDensityHelper = async ({ body }) => {

    const response = await segmentDensityFind(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const segmentDensityHandler = async options => baseHandler(segmentDensityHelper, options);
const segmentDensitySegmentFilterHelper = async({body}) => {
    const response = await segmentDensityTrainSegmentFilter("segment",body);
    return { content: response };
}
const segmentDensitySegmentFilterHandler = async options => baseHandler(segmentDensitySegmentFilterHelper, options);

module.exports = {
    segmentDensityHandler,
    segmentDensitySegmentFilterHandler
}