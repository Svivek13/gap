const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { DESyndicationMetricsFindOne,DESyndicationMetricsAggregation } = require('../models/DESyndicationMetrics');
const { DESyndicationMetricsFind,DESyndicationMetricsLocDistinct ,DESyndicationMetricsAttrDistinct,DESyndicationMetricsBrandDistinct} = require('../models/DESyndicationMetrics');

const dataEngineerSyndHelper = async ({ body }) => {
  
    const response = await DESyndicationMetricsFind(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const dataEngineerSyndHandler = async options => baseHandler(dataEngineerSyndHelper, options);

const dataEngineerSyndAttrHelper = async({body}) => {
    const response = await DESyndicationMetricsAttrDistinct("attribute",body);
    return { content: response };
}
const dataEngineerSyndAttrHandler = async options => baseHandler(dataEngineerSyndAttrHelper, options);
const dataEngineerSyndBrandHelper = async({body}) => {
    const response = await DESyndicationMetricsBrandDistinct("brand",body);
    return { content: response };
}
const dataEngineerSyndBrandHandler = async options => baseHandler(dataEngineerSyndBrandHelper, options);
const dataEngineerSyndLocationHelper = async({body}) => {
    const response = await DESyndicationMetricsLocDistinct("location",body);
    return { content: response };
}
const dataEngineerSyndLocationHandler  = async options => baseHandler(dataEngineerSyndLocationHelper, options);
module.exports = {
    dataEngineerSyndHandler,
    dataEngineerSyndAttrHandler,
    dataEngineerSyndBrandHandler,
    dataEngineerSyndLocationHandler
}