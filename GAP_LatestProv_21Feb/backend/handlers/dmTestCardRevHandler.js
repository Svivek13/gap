
const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { dmTestCardRevFind} = require('../models/dmTestCardRev');

const dmTestCardRevHelper = async ({ body }) => {

    const response = await dmTestCardRevFind(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const dmTestCardRevHandler = async options => baseHandler(dmTestCardRevHelper, options);
module.exports = {
    dmTestCardRevHandler
}