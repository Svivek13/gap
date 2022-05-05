const { mapXaiDataReqQuery } = require('../queryBuilder/xaiQueryGap');
const { projectOutputAggregation } = require('../models/projectOutput');
const { projectExecutionFind } = require('../models/projectExecution');
const { projectFindOne } = require('../models/project');
const { xaiDataAggregation ,xaiDataDistinct,xaiDataLocationDistinct,xaiDataFind} = require('../models/xaiModelGap');
const { mapXaiReqResponse, mapXaiScatterReqResponse } = require('../mappers/xai');
const { baseHandler } = require('../private/base-handler');
const { resolve } = require('path');
const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');

const xaiReqHelper = async ({ body }) => {
    // const model = _get(body, 'model');
    // const brand = _get(body, 'brand');
    // const card_type = _get(body, 'card_type');
    // const xaiQueryGap = mapXaiDataReqQuery({ model, brand, card_type });
   // const xaiQueryGap = mapXaiDataReqQuery(body);
    //console.log("XAIQueryGap:" ,xaiQueryGap);
    const response = await xaiDataFind(body);
   // console.log('xaiReqHelper response: ', response);
   // const finalResponse = mapXaiReqResponse({ data: response[0] });
    return { content: response }


}
const xaiReqHandler = async options => baseHandler(xaiReqHelper, options);

const xaiDrowdownBrandHelper = async({body}) => {
  //  console.log(body);
    const response = await xaiDataDistinct("brand",body);
  //  console.log(response);
    return { content: response };
}
const xaiDropdownBrandHandler = async options => baseHandler(xaiDrowdownBrandHelper, options);
const xaiDrowdownLocationHelper = async({body}) => {
   // console.log(body);
    const response = await xaiDataLocationDistinct("location",body);
   // console.log(response);
    return { content: response };
}
const xaiDropdownLocationHandler = async options => baseHandler(xaiDrowdownLocationHelper, options);
module.exports = {
    xaiReqHandler,
    xaiDropdownBrandHandler,
    xaiDropdownLocationHandler
}
