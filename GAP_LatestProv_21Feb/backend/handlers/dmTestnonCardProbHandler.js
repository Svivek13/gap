
const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { dmTestnonCardProbFind} = require('../models/dmTestnonCardProb');

const dmTestnonCardProbHelper = async ({ body }) => {

    const response = await dmTestnonCardProbFind(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const dmTestnonCardProbHandler = async options => baseHandler(dmTestnonCardProbHelper, options);
module.exports = {
    dmTestnonCardProbHandler
}