const { get: _get } = require('lodash');
const { cleanEntityData } = require('../helpers/commonUtils');

const DEMetricsQuery = ({ data }) => {
    console.log("DEQUEY DATA",data);
    return cleanEntityData({
        pipelineRunId: _get(data, 'pipelineRunId'),
        // execId: _get(data, 'executionId')
    });
};

module.exports = {
    DEMetricsQuery
}
