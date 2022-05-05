
const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { dmTestnonCardRevFind} = require('../models/dmTestnonCardRev');

const dmTestnonCardRevHelper = async ({ body }) => {

    const response = await dmTestnonCardRevFind(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const dmTestnonCardRevHandler = async options => baseHandler(dmTestnonCardRevHelper, options);
module.exports = {
    dmTestnonCardRevHandler
}