
const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { segmentDensityTestFind,segmentDensityTestSegmentFilter} = require('../models/dataDriftSegmentTest');

const segmentDensityTestHelper = async ({ body }) => {

    const response = await segmentDensityTestFind(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const segmentDensityTestHandler = async options => baseHandler(segmentDensityTestHelper, options);
const segmentDensityTestSegmentFilterHelper = async({body}) => {
    const response = await segmentDensityTestSegmentFilter("segment",body);
    return { content: response };
}
const segmentDensityTestSegmentFilterHandler = async options => baseHandler(segmentDensityTestSegmentFilterHelper, options);

module.exports = {
    segmentDensityTestHandler,
    segmentDensityTestSegmentFilterHandler
}