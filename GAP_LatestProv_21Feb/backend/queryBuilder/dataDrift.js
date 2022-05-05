const { get: _get, map: _map } = require('lodash');
const { cleanEntityData } = require('../helpers/commonUtils');
const { CONSTANTS } = require('../helpers/constant');
const moment = require('moment');

const mapDataDriftQuery = ({ selectionQuery, pipelineRunData }) => {
    // const current = moment.utc().endOf('month').toISOString();
    // const previous = moment.utc().subtract(5, 'months').startOf('month').toISOString();

    const pipelineRunIds = _map(pipelineRunData, pd => _get(pd, '_id'));

    return cleanEntityData({
        EAN: _get(selectionQuery, 'sku'),
        Sold_To: _get(selectionQuery, 'dist'),
        Country: _get(selectionQuery, 'country'),
        pipelineRunId: { $in: pipelineRunIds},
        // datetime: { "$gte": new Date(previous), "$lte": new Date(current) }
    });
}


module.exports = {
    mapDataDriftQuery,
}