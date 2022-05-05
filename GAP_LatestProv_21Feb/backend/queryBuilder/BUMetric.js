const { get: _get } = require('lodash');
const { cleanEntityData } = require('../helpers/commonUtils');



const BUMetricsQuery = ({ data }) => {
    return cleanEntityData({
        projectId: _get(data, 'projectId'),
        execId: _get(data, 'executionId')
    });
};


module.exports = {
    BUMetricsQuery
}