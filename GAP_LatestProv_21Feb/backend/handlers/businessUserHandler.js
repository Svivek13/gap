const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { cleanEntityData } = require('../helpers/commonUtils');

const { baseHandler } = require('../private/base-handler');
const { BUMetricsAdminFindOne } = require('../models/BUMetricsAdmin');
const { BUMetricsQuery } = require('../queryBuilder/BUMetric');
const { userFindOne } = require('../models/user');
const { bikeSharing } = require('../helpers/mockData/buMetric');
const { mapBUBankResponse, mapBUTelcoResponse, mapBURossmannRes } = require('../mappers/buMetrics');

const adminProject = {
    Diabetes: async ({ body }) => {
        
        const buQuery = BUMetricsQuery({ data: body });

        const resQuery = await BUMetricsAdminFindOne(buQuery);

        return resQuery;
    },
    ["Telecom Churn"]: async ({ body }) => {
        const buQuery = BUMetricsQuery({ data: body });

        const resQuery = await BUMetricsAdminFindOne(buQuery);
        const mappedResponse = mapBUTelcoResponse({ data: resQuery })
        return mappedResponse;
    },
    ['Bank Marketing']: async ({ body }) => {
        console.log(body);
        const buQuery = BUMetricsQuery({ data: body });
        const resQuery = await BUMetricsAdminFindOne(buQuery);
        const mappedResponse = mapBUBankResponse({ data: resQuery })
        return mappedResponse;
    },
    ['Bike Sharing']: async ({ body }) => {
        const buQuery = BUMetricsQuery({ data: body });
        const resQuery = await BUMetricsAdminFindOne(buQuery);
        return resQuery;
    },
    Rossmann: async({ body }) => {
        const buQuery = BUMetricsQuery({ data: body });
        const resQuery = await BUMetricsAdminFindOne(buQuery);
        // const response = mapBURossmanRes({ data: resQuery });
        const response = mapBURossmannRes({ data: resQuery });
        return response;
    }
}

const businessUserHelper = async({ body }) => {
    const userType = _get(body, 'userType');
    if (userType === 'admin') {
        const proj = adminProject[`${_get(body, 'projectName', '')}`];
        const response = await proj({ body })
        console.log(JSON.stringify(response));
        return { content: response };
    }
}



const businessUserHandler = async options => baseHandler(businessUserHelper, options);

module.exports = {
    businessUserHandler,

}