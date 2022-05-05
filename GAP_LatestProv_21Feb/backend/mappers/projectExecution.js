const { cleanEntityData } = require("../helpers/commonUtils");
const { get: _get, has: _has } = require('lodash');

const mapProjectExecutionData = ({ data }) => cleanEntityData({
    executionName: _get(data, 'name') + '-' + Date.now(),
    executionType: _get(data, 'executionType'),
    explainability: {
        mode: _get(data, 'modelType'),
        testDataTargetVars: _get(data, 'explainability.testDataTargetVars', {}),
        trainDataTargetVars: _get(data, 'explainability.trainDataTargetVars', {})
    },
    modelFile: _get(data, 'fileUrlsObj.model'),
    trainFile: _get(data, 'fileUrlsObj.train'),
    testFile: _get(data, 'fileUrlsObj.test'),
    createdBy: _get(data, 'userId')
})

const mapAddExecutionData = ({ data }) => {
    let trainFile, testFile;

    if (_has(data, "body.trainInput")) {
        trainFile = _get(data, "body.trainInput")
    } else {
        trainFile = _get(data, 'fileUrlsObj.train')
    }
    if (_has(data, "body.testInput")) {
        testFile = _get(data, "body.testInput")
    } else {
        testFile = _get(data, 'fileUrlsObj.test')
    }

    return cleanEntityData({
        projectId: _get(data, 'execFound.projectId'),
        executionName: _get(data, 'foundProject.name') + '-' + Date.now(),
        executionType: _get(data, 'execFound.executionType'),
        explainability: {
            mode: _get(data, 'foundProject.modelType'),
            testDataTargetVars: _get(data, 'execFound.explainability.testDataTargetVars', {}), // logic for this when old file selected
            trainDataTargetVars: _get(data, 'execFound.explainability.trainDataTargetVars', {}) // logic for this when old file selected
        },
        modelFile: _get(data, 'foundProject.modelFile.url'), // remove this field later, no need to save in exec document, already there at project level
        trainFile,
        testFile,
        createdBy: _get(data, 'userId')
    })
}

const mapProjectExecutionResponse = ({ data }) => cleanEntityData({
    executionType: _get(data, 'executionType'),
    explainability: _get(data, 'explainability'),
    testDataHeaderDetails: _get(data, 'testDataHeaderDetails', []),
    trainDataHeaderDetails: _get(data, 'trainDataHeaderDetails', []),
    modelFile: _get(data, 'modelFile'),
    trainFile: _get(data, 'trainFile'),
    testFile: _get(data, 'testFile')
})

const mapLatestExecutionResponse = ({ data }) => cleanEntityData({
    id: _get(data, '_id'),
    testFile: _get(data, 'testFile'),
    trainFile: _get(data, 'trainFile'),
    target: _get(data, 'explainability.testDataTargetVars.label'),
})

module.exports = {
    mapProjectExecutionData,
    mapProjectExecutionResponse,
    mapAddExecutionData,
    mapLatestExecutionResponse
}