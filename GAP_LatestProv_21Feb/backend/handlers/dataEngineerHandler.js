const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { DEMetricsAdminFindOne } = require('../models/DEMetricsAdmin');
const { DEMetricsAdminFind } = require('../models/DEMetricsAdmin');
const { DEMetricsQuery } = require('../queryBuilder/DEMetric');
const { mapDEReqResponse } = require('../mappers/deMetric');


const dataEngineerHelper = async ({ body }) => {

    const response = await DEMetricsAdminFind(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const dataEngineerHandler = async options => baseHandler(dataEngineerHelper, options);
module.exports = {
    dataEngineerHandler
}