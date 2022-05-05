
const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { cockpitFind} = require('../models/cockpitModels');

const cockpitHelper = async ({ body }) => {

    const response = await cockpitFind(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const cockpitHelperDropdownModel = async ({ body }) => {

    const response = await cockpitFind(body)

    const finalResponse = _get(response,'data');
    const dropDown = _get(finalResponse,'finalResponse');
    return { content: dropDown };

}
const cockpitHandler = async options => baseHandler(cockpitHelper, options);
const cockpitHandlerDropDown = async options => baseHandler(cockpitHelperDropdownModel, options);
module.exports = {
    cockpitHandler,
    cockpitHandlerDropDown
}