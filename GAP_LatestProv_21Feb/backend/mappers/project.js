const { cleanEntityData, msToTime } = require("../helpers/commonUtils");
const { get: _get, map: _map, has: _has, isEmpty: _isEmpty } = require('lodash');
const moment = require('moment');

const mapProjectData = ({ data }) => cleanEntityData({
    name: _get(data, 'name'),
    description: _get(data, 'description'),
    modelType: _get(data, 'modelType'),
    createdBy: _get(data, 'userId'),
    modelFile: {
        url: _get(data, 'fileUrlsObj.model')
    },
    trainFiles: [{ url: _get(data, 'fileUrlsObj.train') }],
    testFiles: [{ url: _get(data, 'fileUrlsObj.test') }]
})

const mapProjectResponse = ({ data }) => cleanEntityData({
    name: _get(data, 'name'),
    description: _get(data, 'description'),
    modelType: _get(data, 'modelType'),
    // createdBy: _get(data, 'createdBy')
})


const mapProjectOverviewResponse = ({ data }) => {
    // start end logic
    let runStart = 'NA', runEnd = 'NA', status = 'NA';

    const lesserOf = (firstTimestamp, secondTimestamp) => {
        if (firstTimestamp === 'NA' && secondTimestamp === 'NA') {
            return 'NA'
        } else if (firstTimestamp === 'NA') {
            return secondTimestamp
        } else if (secondTimestamp === 'NA') {
            return firstTimestamp
        } else {
            if ( (firstTimestamp - secondTimestamp) > 0) {
                return secondTimestamp 
            } else {
                return firstTimestamp
            }
        }
    }

    const fartherOf = (firstTimestamp, secondTimestamp) => {
        if (firstTimestamp === 'NA' && secondTimestamp === 'NA') {
            return 'NA'
        } else if (firstTimestamp === 'NA') {
            return secondTimestamp
        } else if (secondTimestamp === 'NA') {
            return firstTimestamp
        } else {
            if ( (firstTimestamp - secondTimestamp) > 0) {
                return firstTimestamp
            } else {
                return secondTimestamp
            }
        }
    }

    const evalStatus = (dStatus, xStatus) => {
        if (!dStatus && !xStatus) {
          return 'NA';
        } else if (!dStatus && xStatus) {
          return xStatus;
        } else if (!xStatus && dStatus) {
          return dStatus;
        } else {
          if (dStatus === 'Failed' || xStatus === 'Failed') {
            return 'Failed'
          } else if (dStatus === 'Running' || xStatus === 'Running') {
            return 'Running'
          } else if (dStatus === 'Success' && xStatus === 'Success') {
            return 'Success'
          } else {
            return 'NA'
          }
        }
      }
    
    runStart = _get(data, 'exec.createdAt', 'NA')
    if (_has(data, "exec.driftexecutionTime") && !_has(data, "exec.xaiexecutionTime")) {
        status = _get(data, 'exec.driftexecutionTime.status', 'NA');
        // runStart = _get(data, 'exec.driftexecutionTime.start', 'NA')
        runEnd = _get(data, 'exec.driftexecutionTime.end', 'NA')
    } else if (!_has(data, "exec.driftexecutionTime") && _has(data, "exec.xaiexecutionTime")) {
        status = _get(data, 'exec.xaiexecutionTime.status', 'NA');
        // runStart = _get(data, 'exec.createdAt', 'NA')
        runEnd = _get(data, 'exec.xaiexecutionTime.end', 'NA')
    } else if (_has(data, "exec.driftexecutionTime") && _has(data, "exec.xaiexecutionTime")) {
        status = evalStatus(_get(data, 'exec.driftexecutionTime.status', 'NA'), _get(data, 'exec.xaiexecutionTime.status', 'NA'));
        // runStart = lesserOf(_get(data, 'exec.xaiexecutionTime.start', 'NA'), _get(data, 'exec.driftexecutionTime.start', 'NA'))
        runEnd = fartherOf(_get(data, 'exec.xaiexecutionTime.end', 'NA'), _get(data, 'exec.driftexecutionTime.end', 'NA'))
    }

    // duration calc below
    const dates_array = cleanEntityData([
    _get(data, 'exec.driftexecutionTime.end'),
    _get(data, 'exec.createdAt'),
    _get(data, 'exec.xaiexecutionTime.end')
    ]);
    let duration;
    if (_isEmpty(dates_array)) {
        duration = "NA";
    } else {
        const maxDate = dates_array.reduce(function (a, b) { 
            return a > b ? a : b; 
        });
        const minDate = dates_array.reduce(function (a, b) { 
            return a < b ? a : b; 
        });
        duration = msToTime(maxDate - minDate);
        // console.log(`date_array is ${dates_array}, maxDate is ${maxDate}, minDate is ${minDate}, duration for ${_get(data, 'name')} is ${duration}`)
    }
    // duration calc above

    // console.log('exec 3 fields: ', _get(data, 'exec'));

    const latestExec = {
        id: _get(data, 'exec._id'),
        testFile: _get(data, 'exec.testFile'),
        trainFile: _get(data, 'exec.trainFile'),
        target: _get(data, 'exec.explainability.testDataTargetVars.label'),
    }

    return cleanEntityData({
        status,
        projectId: _get(data, '_id'),
        name: _get(data, 'name'),
        executionType: (_get(data, 'exec.executionType')),
        runStart,
        runEnd,
        createdBy: _get(data, 'user') || 'admin',
        drift: _get(data, 'output.drift_output.overall_drift_value'),
        duration,
        latestExec,
    })
} 


const mapAdminProjectOverviewResponse = ({ data }) => {
    // start end logic
    let runStart = 'NA', runEnd = 'NA', status = 'NA';

    const lesserOf = (firstTimestamp, secondTimestamp) => {
        if (firstTimestamp === 'NA' && secondTimestamp === 'NA') {
            return 'NA'
        } else if (firstTimestamp === 'NA') {
            return secondTimestamp
        } else if (secondTimestamp === 'NA') {
            return firstTimestamp
        } else {
            if ( (firstTimestamp - secondTimestamp) > 0) {
                return secondTimestamp 
            } else {
                return firstTimestamp
            }
        }
    }

    const fartherOf = (firstTimestamp, secondTimestamp) => {
        if (firstTimestamp === 'NA' && secondTimestamp === 'NA') {
            return 'NA'
        } else if (firstTimestamp === 'NA') {
            return secondTimestamp
        } else if (secondTimestamp === 'NA') {
            return firstTimestamp
        } else {
            if ( (firstTimestamp - secondTimestamp) > 0) {
                return firstTimestamp
            } else {
                return secondTimestamp
            }
        }
    }

    const evalStatus = (dStatus, xStatus) => {
        if (!dStatus && !xStatus) {
          return 'NA';
        } else if (!dStatus && xStatus) {
          return xStatus;
        } else if (!xStatus && dStatus) {
          return dStatus;
        } else {
          if (dStatus === 'Failed' || xStatus === 'Failed') {
            return 'Failed'
          } else if (dStatus === 'Running' || xStatus === 'Running') {
            return 'Running'
          } else if (dStatus === 'Success' && xStatus === 'Success') {
            return 'Success'
          } else {
            return 'NA'
          }
        }
      }
    
    if (_has(data, "exec.properties.driftexecutionTime") && !_has(data, "exec.properties.xaiexecutionTime")) {
        status = _get(data, 'exec.properties.driftexecutionTime.status', 'NA');
        runStart = _get(data, 'exec.properties.driftexecutionTime.start', 'NA')
        runEnd = _get(data, 'exec.properties.driftexecutionTime.end', 'NA')
    } else if (!_has(data, "exec.properties.driftexecutionTime") && _has(data, "exec.properties.xaiexecutionTime")) {
        status = _get(data, 'exec.properties.xaiexecutionTime.status', 'NA');
        runStart = _get(data, 'exec.properties.xaiexecutionTime.start', 'NA')
        runEnd = _get(data, 'exec.properties.xaiexecutionTime.end', 'NA')
    } else if (_has(data, "exec.properties.driftexecutionTime") && _has(data, "exec.properties.xaiexecutionTime")) {
        status = evalStatus(_get(data, 'exec.properties.driftexecutionTime.status', 'NA'), _get(data, 'exec.properties.xaiexecutionTime.status', 'NA'));
        runStart = lesserOf(_get(data, 'exec.properties.xaiexecutionTime.start', 'NA'), _get(data, 'exec.properties.driftexecutionTime.start', 'NA'))
        runEnd = fartherOf(_get(data, 'exec.properties.xaiexecutionTime.end', 'NA'), _get(data, 'exec.properties.driftexecutionTime.end', 'NA'))
    }

    // duration calc below
    const dates_array = cleanEntityData([
    _get(data, 'exec.properties.driftexecutionTime.end'),
    _get(data, 'exec.properties.driftexecutionTime.start'),
    _get(data, 'exec.properties.xaiexecutionTime.end'),
    _get(data, 'exec.properties.xaiexecutionTime.start')
    ]);
    let duration;
    if (_isEmpty(dates_array)) {
        duration = "NA";
    } else {
        const maxDate = dates_array.reduce(function (a, b) { 
            return a > b ? a : b; 
        });
        const minDate = dates_array.reduce(function (a, b) { 
            return a < b ? a : b; 
        });
        duration = msToTime(maxDate - minDate);
        // console.log(`date_array is ${dates_array}, maxDate is ${maxDate}, minDate is ${minDate}, duration for ${_get(data, 'name')} is ${duration}`)
    }
    // duration calc above

    // console.log('exec 3 fields: ', _get(data, 'exec'));

    const latestExec = {
        id: _get(data, 'exec._id'),
        trainFile: _get(data, 'exec.properties.trainFile'),
        target: _get(data, 'exec.properties.explainability.trainDataTargetVars.label'),
    }

    return cleanEntityData({
        status,
        projectId: _get(data, '_id'),
        name: _get(data, 'properties.name'),
        executionType: (_get(data, 'exec.properties.executionType')),
        runStart,
        runEnd,
        createdBy:'admin',
        drift: _get(data, 'output.properties.drift_output.overall_drift_wtd'),
        duration,
        latestExec,
    })
}

const mapAutoConfigData = ({ data }) => _map(data, d => cleanEntityData({
    projectId: _get(d, '_id'),
    name: _get(d, 'name'),
    description: _get(d, 'description'),
    modelType: _get(d, 'modelType'),
    executionType: _get(d, 'executions[0].executionType'),
    explainability: _get(d, 'executions[0].explainability'),
    modelFile: _get(d, 'modelFile'),
    trainFile: _get(d, 'trainFiles'),
    testFile: _get(d, 'testFiles')
}));

const mapProjectDropdowns = ({ data }) => _map(data, d => cleanEntityData({
    displayText: _get(d, 'name'),
    value: _get(d, '_id')
}));

const findDuration = ({ runStart, runEnd }) => {
    // console.log(runStart, runEnd, 'working');
    if (runStart && runEnd) {
        // console.log('checking wroking');
        const timeStamp = moment.duration(moment(runEnd).diff(moment(runStart)))
        // console.log('timestamp', timeStamp);
        return timeStamp.get("hours") +"h :"+ timeStamp.get("minutes") +"min :"+ timeStamp.get("seconds") + "s";
    }
    return null;
}
const mapProvenanceProjectResponse = ({ data }) => {
     console.log('data found');
    return _map(data, d => cleanEntityData({
        status: _get(d, 'status'),
        projectId: _get(d, '_id'),
        projectType: _get(d, 'projectType'),
        runStart: _get(d, 'runStart'),
        runEnd: _get(d, 'runEnd'),
        createdBy: _get(d, 'createdBy'),
        name: _get(d, 'name'),
        model:_get(d,'model'),
        duration: findDuration({ runStart: _get(d, 'runStart'), runEnd: _get(d, 'runEnd')})
    
    }));
};
module.exports = {
    mapProjectData,
    mapAutoConfigData,
    mapProjectResponse,
    mapProjectDropdowns,
    mapProjectOverviewResponse,
    mapAdminProjectOverviewResponse,
    mapProvenanceProjectResponse
}