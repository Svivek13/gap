
const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { dmTrainnonCardRevFind} = require('../models/dmTrainnonCardRev');

const dmTrainnonCardRevHelper = async ({ body }) => {

    const response = await dmTrainnonCardRevFind(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const dmTrainnonCardRevHandler = async options => baseHandler(dmTrainnonCardRevHelper, options);
module.exports = {
    dmTrainnonCardRevHandler
}