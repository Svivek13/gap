const { get: _get, map: _map, isEmpty: _isEmpty, isFinite: _isFinite } = require('lodash');

const mapDEReqResponse = ({ data }) => {
    const latest = data[0];
    const projectId = _get(latest, 'pipelineRunId', null);
    const interpreterDetails = _get(latest, 'interpreterDetails', {});
    let execIds = [];
    let testFileRowCount = [];
    let execTime = [];
    let execCost = [];
    _map(data, d => {
        execIds.push(_get(d, 'execId'));
        testFileRowCount.push(_get(d, 'testFileRowCount'));
        execTime.push({
            overallTime: _get(d, 'overallTime'),
            driftExecutionTime: _get(d, 'driftExecutionTime'),
            xaiExecutionTime: _get(d, 'xaiExecutionTime')
        });
        execCost.push({
            overallCost: _get(d, 'overallCost'),
            driftExecutionCost: _get(d, 'driftExecutionCost'),
            xaiExecutionCost: _get(d, 'xaiExecutionCost')
        });

    });

    return {
        projectId: projectId,
        interpreterDetails: interpreterDetails,
        execIds,
        testFileRowCount,
        execTime,
        execCost
    }
};

module.exports = {
    mapDEReqResponse,
}
