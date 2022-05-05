
const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { dataDriftTestCardProbFind} = require('../models/dataDriftTestCardProb');

const dataDriftTestHelper = async ({ body }) => {

    const response = await dataDriftTestCardProbFind(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const dataDriftTestHandler = async options => baseHandler(dataDriftTestHelper, options);
module.exports = {
    dataDriftTestHandler
}