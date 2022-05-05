const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { dataDriftMetricFind_GAP,dataDMDriftGapDistinctLocation,dataDMDriftGapDistinctBrand} = require('../models/dataDrift_gap');
const { dataDriftGapFind_GAP,dataDriftGapDistinctLocation,dataDriftGapDistinctBrand} = require('../models/dataDriftGap');
const dataDriftGapHelper = async ({ body }) => {

    const response = await dataDriftMetricFind_GAP(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const dataDriftGapHandler = async options => baseHandler(dataDriftGapHelper, options);
const dataDrift_GapHelper = async ({ body }) => {

    const response = await dataDriftGapFind_GAP(body)
    //console.log("Query Drift: ",JSON.stringify(dataDriftGapFind_GAP(body)));
    const finalResponse = response;

    return { content: finalResponse };

}
const dataDrift_GapHandler = async options => baseHandler(dataDrift_GapHelper, options);

const dataDrift_GapDrowdownBrandHelper = async({body}) => {
    const response = await dataDriftGapDistinctBrand("brand",body);
    return { content: response };
}
const dataDrift_GapDropdownBrandHandler = async options => baseHandler(dataDrift_GapDrowdownBrandHelper, options);
const dataDrift_GapDrowdownLocationHelper = async({body}) => {
    const response = await dataDriftGapDistinctLocation("location",body);
    return { content: response };
}
const dataDrift_GapDropdownLocationHandler = async options => baseHandler(dataDrift_GapDrowdownLocationHelper, options);

const dataDMDrift_GapDrowdownBrandHelper = async({body}) => {
   const response = await dataDMDriftGapDistinctBrand("brand",body);
    return { content: response };
}
const dataDMDrift_GapDropdownBrandHandler = async options => baseHandler(dataDMDrift_GapDrowdownBrandHelper, options);
const dataDMDrift_GapDrowdownLocationHelper = async({body}) => {
    const response = await dataDMDriftGapDistinctLocation("location",body);
    return { content: response };
}
const dataDMDrift_GapDropdownLocationHandler = async options => baseHandler(dataDMDrift_GapDrowdownLocationHelper, options);

module.exports = {
    dataDriftGapHandler,
    dataDrift_GapHandler,
    dataDrift_GapDropdownBrandHandler,
    dataDrift_GapDropdownLocationHandler,
    dataDMDrift_GapDropdownBrandHandler,
    dataDMDrift_GapDropdownLocationHandler
}