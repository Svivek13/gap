
const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { dmTrainCardRevFind} = require('../models/dmTrainCardRev');

const dmTrainCardRevHelper = async ({ body }) => {

    const response = await dmTrainCardRevFind(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const dmTrainCardRevHandler = async options => baseHandler(dmTrainCardRevHelper, options);
module.exports = {
    dmTrainCardRevHandler
}