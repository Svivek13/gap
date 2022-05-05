const { get: _get, map: _map, isEmpty: _isEmpty, forEach: _forEach, reduce: _reduce, find: _find } = require('lodash');
const { cleanEntityData } = require('../helpers/commonUtils');
const { CONSTANTS } = require('../helpers/constant');


// const mapActivityRunsSearchResponse = ({ data }) => _map(data, d => cleanEntityData({
//     activityName: _get(d, 'activityName'),
//     activityRunStart: _get(d, 'activityRunStart'),
//     status: _get(d, 'status'),
//     activityRunId: _get(d, 'activityRunId'),
//     message: !_isEmpty(_get(d, 'error.errorCode')) && !_isEmpty(_get(d, 'error.message'))? `${_get(d, 'error.errorCode')}: ${_get(d, 'error.message')}`: null,
//     functionName: _get(d, 'function_name'),
// }));

const mapActivityRunsSearchResponse = ({ activity, pipeline }) => _reduce( _get(pipeline, 'properties.activities'), (acc, d) => {
    // console.log(activity, _get(d, 'name'));
    const selectedActivity = _get(activity, _get(d, 'name'));
    // console.log(selectedActivity);
    let response;
    if (selectedActivity){
        response = cleanEntityData({
            activityName: _get(selectedActivity, 'activityName'),
            activityRunStart: _get(selectedActivity, 'activityRunStart'),
            status: _get(selectedActivity, 'status'),
            activityRunId: _get(selectedActivity, 'activityRunId'),
            message: !_isEmpty(_get(selectedActivity, 'error.errorCode')) && !_isEmpty(_get(selectedActivity, 'error.message'))? `${_get(selectedActivity, 'error.errorCode')}: ${_get(selectedActivity, 'error.message')}`: null,
        });
    } else {
        response = cleanEntityData({
            activityName: _get(d, 'name'),
        });
    }
    acc.push(response);
    return acc;

}, []);

const findActivityLastGroupedObj = ({ data }) => {

    const response = _reduce(data, (acc, val, key) => {
        let len = val.length;
        // let lastValue;
        // if (len >= 1) {
        //     const inProgressTask = _find(val, ['status', `${_get(CONSTANTS, 'status.inProgress')}`]);
        //     if (!_isEmpty(inProgressTask)) {
        //         lastValue = inProgressTask;
        //     } else {
        //         lastValue = val[len-1];
        //     }
        // }
        let lastValue = val[len-1];
        acc[key] = lastValue;
        return acc;
    }, {});
    // console.log('response', response);
    return response;
}


module.exports = {
    mapActivityRunsSearchResponse,
    findActivityLastGroupedObj,
};