const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { DEMetricsDrillDownFindOne } = require('../models/DEMetricsDrillDownModel');
const { DEMetricsDrillDownFind } = require('../models/DEMetricsDrillDownModel');

const DEMetricsDrillDownHelper = async ({ body }) => {

    const response = await DEMetricsDrillDownFind(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const DEMetricsDrillDownHandler = async options => baseHandler(DEMetricsDrillDownHelper, options);
module.exports = {
    DEMetricsDrillDownHandler
}