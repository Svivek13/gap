const { get: _get, map: _map } = require('lodash');
const { cleanEntityData } = require('../helpers/commonUtils');



const mapDataEngineerData = ({ data, year, month, latestPipelineRunDatetime, pipelineName }) => {
    const rowCounts = _map(_get(data, 'row_counts'), rc => cleanEntityData({
        "source_name" : _get(rc, 'source_name'), 
        "sink_name" : _get(rc, 'sink_name'), 
        "source_count" :_get(rc, 'source_count'), 
        "sink_count" : _get(rc, 'sink_count'), 
        "error_flag" : _get(rc, 'error_flag')
    }));
    const indexCounts = _map(_get(data, 'index_counts'), ic => cleanEntityData({
        "table_name" : _get(ic, 'table_name'), 
        "total_indexes" : _get(ic, 'total_indexes'), 
        "indexes_enabled" : _get(ic, 'indexes_enabled'), 
        "error_flag" : _get(ic, 'error_flag')
    }));
    return cleanEntityData({
        pipelineRunId: _get(data, 'pipelineRunId'),
        pipelineName,
        rowCounts,
        indexCounts,
        year,
        month,
        latestPipelineRunDatetime
    });

};



module.exports = {
    mapDataEngineerData,
}