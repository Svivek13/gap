const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { timelinessFind_GAP } = require('../models/timelinessModel');

const timelinessHelper = async ({ body }) => {

    const response = await timelinessFind_GAP(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const timelinessHandler = async options => baseHandler(timelinessHelper, options);
module.exports = {
    timelinessHandler
}