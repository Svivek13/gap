const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { dqmCompletenessFind_GAP } = require('../models/dqmCompletenessModel');

const dqmCompletenessHelper = async ({ body }) => {

    const response = await dqmCompletenessFind_GAP(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const dqmCompletenessHandler = async options => baseHandler(dqmCompletenessHelper, options);
module.exports = {
    dqmCompletenessHandler
}