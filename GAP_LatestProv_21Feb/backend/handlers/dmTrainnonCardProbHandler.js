
const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { dmTrainnonCardProbFind} = require('../models/dmTrainnonCardProb');

const dmTrainnonCardProbHelper = async ({ body }) => {

    const response = await dmTrainnonCardProbFind(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const dmTrainnonCardProbHandler = async options => baseHandler(dmTrainnonCardProbHelper, options);
module.exports = {
    dmTrainnonCardProbHandler
}