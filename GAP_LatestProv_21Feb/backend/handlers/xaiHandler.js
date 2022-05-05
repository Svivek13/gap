const { mapXaiReqQuery, mapXaiScatterPlotReqQuery, mapAdminXaiReqQuery } = require('../queryBuilder/xai');
const { projectOutputAggregation } = require('../models/projectOutput');
const { projectExecutionFind } = require('../models/projectExecution');
const { projectFindOne } = require('../models/project');
const { projectOutputAdminAggregation } = require('../models/projectOutputAdmin');
const { mapXaiReqResponse, mapXaiScatterReqResponse } = require('../mappers/xai');
const { baseHandler } = require('../private/base-handler');
const { resolve } = require('path');
const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');

const xaiReqHelper = async ({ body }) => {
    const projectId = _get(body, 'projectId');
    const projectFound = await projectFindOne( { _id: projectId });
    if (projectFound) {
        // limit on xai_output global_exp array size, to do
        const xaiQuery = mapXaiReqQuery({ projectId });
        console.log("XAI Query: ",xaiQuery);
        const response = await projectOutputAggregation(xaiQuery);
        console.log('xaiReqHelper response: ', response);
        const finalResponse = mapXaiReqResponse({ data: response[0] });
        return { content: finalResponse  }
    } else {
        const xaiQuery = mapAdminXaiReqQuery({ projectId });
        console.log("XAI Query: ",xaiQuery);
        const response = await projectOutputAdminAggregation(xaiQuery);
        console.log('xaiReqHelper response: ', response);
        const finalResponse = mapXaiReqResponse({ data: response[0] });
        return { content: finalResponse  }
    }
    
}
const xaiReqHandler = async options => baseHandler(xaiReqHelper, options);

const xaiScatterPlotReqHelper = async ({ body }) => {
    const projectId = _get(body, 'projectId');

    // limit on xai_output global_exp array size, to do
    const xaiScatterPlotQuery = mapXaiScatterPlotReqQuery({ projectId });
    const response = await projectOutputAggregation(xaiScatterPlotQuery);
    console.log('response: ', response);
    const finalResponse = mapXaiScatterReqResponse({ data: response[0], xAxis, yAxis });
    return { content: finalResponse  }
}
const xaiScatterPlotReqHandler = async options => baseHandler(xaiScatterPlotReqHelper, options);

module.exports = {
    xaiReqHandler,
    xaiScatterPlotReqHandler
}
