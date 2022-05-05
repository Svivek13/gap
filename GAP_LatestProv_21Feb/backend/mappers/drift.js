const { get: _get, map: _map, isEmpty: _isEmpty, isFinite: _isFinite, isEqual: _isEqual } = require('lodash');

const mapDriftReqResponse = ({ data, execId, showAllExec }) => {
    let latest;
    if (_isEqual(showAllExec, 'y')) {
        latest = data.find(item => item.execId == execId)
    } else {
        latest = data[data.length -1];
    }
    const latestDrift = _get(latest, 'drift_output.overall_drift_value', null);
    let latestFeatures = _get(latest, 'drift_output.feature_drift_value', {});
    
    // ES10 solution breaking for node 10.24.0
    // object.fromentries is not a function
    // sort latestFeatures in desc order
    // latestFeatures = Object.fromEntries(
    //     Object.entries(latestFeatures).sort(([,a],[,b]) => b-a)
    // );

    // ES8 solution for node 10.24.0
    latestFeatures = Object.entries(latestFeatures)
    .sort(([,a],[,b]) => b-a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    const latestExecution = _get(latest, 'executions._id', null);
    let driftTrend = [];
    let featureTrend = [];
    _map(data, d =>  {
        // console.log('updatedAt', _get(d, 'updatedAt'), d);
        // console.log(_get(d, 'drift_output.overall_drift_wtd'), _isFinite(_get(d, 'drift_output.overall_drift_wtd')));
        if (_isFinite(_get(d, 'drift_output.overall_drift_value'))) {
            driftTrend.push(
                {
                    execId: _get(d, `executions._id`),
                    dateTime: _get(d, `executions.updatedAt`),
                    driftValue: _get(d, `drift_output.overall_drift_value`)
                }
            );
        }

        if (!_isEmpty(_get(d, 'drift_output.feature_drift_value'))) {
            featureTrend.push(
                {
                    execId: _get(d, `executions._id`),
                    dateTime: _get(d, 'executions.updatedAt'),
                    featureDetails: _get(d, 'drift_output.feature_drift_value')
                }
            );
        }
        
        
    });

    return {
        latestDrift: latestDrift,
        latestFeatures: latestFeatures,
        latestExecution,
        driftTrend,
        featureTrend
    }
};


module.exports = {
    mapDriftReqResponse,
}
