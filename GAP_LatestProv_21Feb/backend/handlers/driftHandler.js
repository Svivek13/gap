const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce, isFinite: _isFinite, isEqual: _isEqual } = require('lodash');
const { cleanEntityData } = require('../helpers/commonUtils');
const { projectOutputAggregation } = require('../models/projectOutput');
const { projectOutputAdminAggregation } = require('../models/projectOutputAdmin');
const { projectExecutionAdminFindOne } = require('../models/projectExecutionsAdmin');
const { projectExecutionFindOne } = require('../models/projectExecution');
const { baseHandler } = require('../private/base-handler');
const { mapDriftReqQuery, mapAdminDriftReqQuery } = require('../queryBuilder/drift');
const { mapDriftReqResponse } = require('../mappers/drift');
// const { exec } = require('child_process');
const { downloadFromAzure } = require('../private/download-from-azure');
const { CONSTANTS } = require("../helpers/constant");
const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');

const JSONStream = require('JSONStream');
const es = require('event-stream');

const { env } = require('../config/env');





const sortArrayValue = ({ data }) => {
    response = data.sort((a, b) => a - b);
    return response;
}

const storage = require('azure-storage');
const { projectFindOne } = require('../models/project');

// const connectionString = "DefaultEndpointsProtocol=https;AccountName=mlwlitestorageqa;AccountKey=6ycsWBIYEOIW5AIQcaO9m1YJ3JwPzTA4mNov8r8+D0A3Ytiw62nKPq9LuQOPv47C+yyvWAY4ts9xYPqSGxXXfQ==;EndpointSuffix=core.windows.net";
const connectionString = _get(env, 'storage.connectionString');
const blobService = storage.createBlobService(connectionString);
const containerName = _get(env, 'storage.containerName');


const downloadFromAzureData = ({blobName}) => new Promise((resolve, reject) => {
    
        const presentTimeStamp = new Date().getTime();
        const fileName = 'downloads/' + presentTimeStamp + '_' + blobName.split('/').join('_');
        // console.log(fileName, '==================================');
        
        
        blobService.getBlobToStream(containerName, blobName, fs.createWriteStream(fileName), function(error, result, response) {
            if (!error) {
              
    
                return resolve(fileName)
                
            } else {
                console.log('error in downloading from azure', error);
              return reject(error);
            }
          });
    });
        
    

const readFile = {
    [`${_get(CONSTANTS, 'fileType.csv')}`]: ({ file }) => new Promise((resolve, reject) => {
            const featureValue = [];
            // console.log('=================', file.path);
            csv.parseFile(file.path, { headers: true })
                .on("data", function(data) {
                    const value = _get(data, `${file.featureName}`);
                    // console.log(data, file.featureName);
                    if (value) {
                        featureValue.push(_toNumber(value));
                    }
                    // featureValue.push(_get(data, `${file.featureName}`)); // push each row
                    // console.log(data);
                })
                .on("end", function() {
                    fs.unlinkSync(file.path); // remove uploaded file
                    // sortedValue = sortArrayValue({ data: featureValue });
                    return resolve(featureValue);
                });
        })
        .catch(err => { throw (err) }),
    [`${_get(CONSTANTS, 'fileType.excel')}`]: ({ file }) => new Promise((resolve, reject) => {
            const fileRows = [];
            csv.parseFile(file.path, { headers: true, maxRows: 10 })
                .on("data", function(data) {
                    fileRows.push(data); // push each row
                    // console.log(data);
                })
                .on("end", function() {
                    fs.unlinkSync(file.path); // remove uploaded file
                    return resolve(fileRows);
                });
        })
        .catch(err => { throw (err) }),
    [`${_get(CONSTANTS, 'fileType.json')}`]: async({ file }) => {
        // const rawData = fs.readFileSync('uploads/1609923199974-upload.json', 'utf-8');
        // const rawData = fs.readFileSync(file.path, 'utf-8');
        // const jsonData = JSON.parse(rawData);

        let jsonData = []
        const getStream = function() {
            const stream = fs.createReadStream(file.path, { encoding: 'utf8' });
            const parser = JSONStream.parse('*');
            return stream.pipe(parser);
        };

        // let i = 0;
        const featureValue = [];
        const exec = () => new Promise((resolve, reject) => {
            getStream()
                .pipe(es.mapSync(function(data) {
                    // if (i < 10) {
                    //     jsonData.push(data);
                    //     // console.log(data);
                    // }
                    // if (i === 10) {
                    //     return resolve(jsonData);
                    // }

                    const value = _get(data, `${file.featureName}`);
                    if (value) {
                        featureValue.push(_toNumber(value));
                    }
                    // i++;
                }))
                .on('error', (err) => {
                    console.log('Error in train vs test read stream...', err)
                    return reject(err);
                })
                .on('end', () => {
                    resolve(featureValue);
                });
                
        })

        jsonData = await exec();
        fs.unlinkSync(file.path); // remove uploaded file
        return jsonData;
    }
};


findMimeType = ({ filePath }) => {
    const mimetypeArray = path.extname(filePath || '').split('.');
    let mimetype = mimetypeArray[mimetypeArray.length - 1]
        // console.log(mimetype);
    if (mimetype === 'csv') {
        mimetype = `text/${mimetype}`;
    } else if (mimetype === 'json') {
        mimetype = `applicatoin/${mimetype}`;
    } else if (mimetype === 'excel') {
        mimetype = 'application/vnd.ms-excel';
    }

    return mimetype;
};


const readFileData = async({ mimetype, filePath, featureName }) => {
    const r = readFile[mimetype];
    const file = {
        path: filePath,
        featureName,
    };
    const response = await r({ file });
    // console.log('===========', response);
    return response;
}

const findRangeAndCount = ({ train = [], test = [], steps }) => {
    if (_isEmpty(train) && _isEmpty(test)) {
        return [];
    }


    const mergedArray = train.concat(test);
    // console.log(JSON.stringify(mergedArray));
    
    let globalMin;
    let globalMax;
    if (!_isEmpty(mergedArray)) {
        globalMin = _toNumber(_min(mergedArray));
        globalMax = _toNumber(_max(mergedArray));


    }
    // console.log(globalMin, globalMax);
    let globalDiff;

    if (_isFinite(globalMin) && _isFinite(globalMax)) {
        globalDiff = globalMax - globalMin;

    }

    const stepSize = globalDiff && Math.abs(globalDiff / steps);

    let range = [];
    // console.log(globalMin, globalMax, globalDiff, stepSize);
    if (stepSize) {
        let newMin;
        let i = globalMin;
        // for (let i = 0; i < step ; i++) {
        while (i <= globalMax) {
            if (i === globalMin) {
                newMin = globalMin + stepSize
                const obj = {
                    min: globalMin,
                    max: newMin,
                }
                range.push(obj);

            } else {
                const obj = {
                    min: newMin,
                    max: newMin + stepSize,
                }

                range.push(obj);
                newMin = newMin + stepSize;
            }
            i = i + stepSize;
            // console.log(i);
            // break;
        }
    };

    const countTrainValue = new Map();
    const countTestValue = new Map();
    for (let i = 0; i < range.length; i++) {
        const maxValue = _get(range, `${i}.max`);
        const minValue = _get(range, `${i}.min`);
        for (let j = 0; j < train.length; j++) {
            if (train[j] < maxValue && train[j] >= minValue) {
                if (countTrainValue.has(minValue)) {
                    const prevValue = countTrainValue.get(minValue);
                    countTrainValue.set(minValue, prevValue + 1);
                } else {
                    countTrainValue.set(minValue, 1);
                }
            }
        };

        for (let k = 0; k < test.length; k++) {
            if (test[k] < maxValue && test[k] >= minValue) {
                if (countTestValue.has(minValue)) {
                    const prevValue = countTestValue.get(minValue);
                    countTestValue.set(minValue, prevValue + 1);
                } else {
                    countTestValue.set(minValue, 1);
                }
            }
        }

    };

    // console.log(countTestValue, countTrainValue);
    const testLength = test.length;
    const trainLength = train.length;
    const finalData = _reduce(range, (acc, val) => {
        const minValue = _get(val, 'min');
        let virtualAcc = {};
        if (countTrainValue.has(minValue)) {
            virtualAcc = {
                ...val,
                // trainCount: countTrainValue.get(minValue),
                trainCount: (countTrainValue.get(minValue)/trainLength) * 100,
            };
        } else {
            virtualAcc = {
                ...val,
                trainCount: 0
            }
        }
        // console.log('virtual acc', virtualAcc);
        if (countTestValue.has(minValue)) {
            virtualAcc = {
                ...virtualAcc,
                // testCount: countTestValue.get(minValue),
                testCount: (countTestValue.get(minValue)/testLength) * 100,

            }
        } else {
            virtualAcc = {
                ...virtualAcc,
                testCount: 0
            }
        }
        acc.push(virtualAcc);
        return acc;
    }, []);

    // console.log('final Data', finalData);
    // console.log(testLength, trainLength);
    return finalData;

}


const driftReqHelper = async({ body }) => {
    const projectId = _get(body, 'projectId');
    const execId = _get(body, 'execId');
    const showAllExec = _get(body, 'showAllExec');
    let projectFound = await projectFindOne({ _id: projectId })
    // if project found in non-admin projects collection
    if (projectFound) {
        let execTill;
        if (execId && !_isEqual(showAllExec, 'y')) {
            const exec = await projectExecutionFindOne({ _id: execId, projectId });
            execTill = _get(exec, "createdAt");
        }
        const driftQuery = mapDriftReqQuery({ projectId, execTill, limit: 20 });
        const response = await projectOutputAggregation(driftQuery);
        // console.log('drift response length: ', response.length);
        console.log('drift response', response);
        const finalResponse = mapDriftReqResponse({ data: response, execId, showAllExec });
        return { content: finalResponse };
    } else {
        let execTill;
        if (execId && !_isEqual(showAllExec, 'y')) {
            const exec = await projectExecutionAdminFindOne({ _id: execId, projectId });
            execTill = _get(exec, "createdAt");
        }
        const driftQuery = mapAdminDriftReqQuery({ projectId, execTill, limit: 20 });
        const response = await projectOutputAdminAggregation(driftQuery);
        // console.log('drift response length: ', response.length);
        // console.log('drift response', JSON.stringify(response));
        const finalResponse = mapDriftReqResponse({ data: response, execId, showAllExec });
        return { content: finalResponse };
    }

}
const driftReqHandler = async options => baseHandler(driftReqHelper, options);

const driftTestVsTrainHelper = async({ body }) => {
    const execId = _get(body, 'execId');
    const featureName = _get(body, 'featureName');

    let execDetail = await projectExecutionFindOne({ _id: execId });
    if (!execDetail) {
        execDetail = await projectExecutionAdminFindOne({ _id: execId });
    }
    // console.log("execId, featureName", execId, featureName)
    // console.log("execDetail", execDetail)
    // console.log('blobname is: ', blobName)
    const [trainFile, testFile] = await Promise.all([
        downloadFromAzureData({ blobName: _get(execDetail, 'trainFile') }),
        downloadFromAzureData({ blobName: _get(execDetail, 'testFile') })
    ]);
    // console.log('++++++++++++++++++', trainFile, testFile);

    const testMimeType = findMimeType({ filePath: testFile });
    const trainMimeType = findMimeType({ filePath: trainFile });

    const trainFileResponse = await readFileData({ mimetype: trainMimeType, filePath: trainFile, featureName });
    const testFileResponse = await readFileData({ mimetype: testMimeType, filePath: testFile, featureName });

    // console.log(trainFileResponse,'=================',  testFileResponse);
    const response = findRangeAndCount({ train: trainFileResponse, test: testFileResponse, steps: 8 });

    // fs.unlinkSync(filePath);


    // return { content: { trainFileResponse, testFileResponse } };
    return { content: { response } };
}

const driftTestVsTrainHandler = async options => baseHandler(driftTestVsTrainHelper, options);

module.exports = {
    driftReqHandler,
    driftTestVsTrainHandler,
}
