
const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { trainDensityFind} = require('../models/trainDensityModel');

const trainDensityHelper = async ({ body }) => {

    const response = await trainDensityFind(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const trainDensityHandler = async options => baseHandler(trainDensityHelper, options);
module.exports = {
    trainDensityHandler
}