const { cleanEntityData } = require('../helpers/commonUtils');
const { get: _get } = require('lodash');

const pipelineGraphQuery = ({ data }) => cleanEntityData({
    _id: _get(data, 'pipelineId')
});

module.exports = {
    pipelineGraphQuery
}