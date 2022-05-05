
const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { dataDriftTrainCardProbFind} = require('../models/dataDriftTrainCardProb');

const dataDriftTrainHelper = async ({ body }) => {

    const response = await dataDriftTrainCardProbFind(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const dataDriftTrainHandler = async options => baseHandler(dataDriftTrainHelper, options);
module.exports = {
    dataDriftTrainHandler
}