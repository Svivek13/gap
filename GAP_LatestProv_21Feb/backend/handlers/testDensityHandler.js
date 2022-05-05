
const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { testDensityFind} = require('../models/testDensityModels');

const testDensityHelper = async ({ body }) => {

    const response = await testDensityFind(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const testDensityHandler = async options => baseHandler(testDensityHelper, options);
module.exports = {
    testDensityHandler
}