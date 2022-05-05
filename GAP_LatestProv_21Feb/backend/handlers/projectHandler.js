const { baseHandler } = require('../private/base-handler');
const { saveAzure } = require('../private/save-to-azure');
const { downloadFromAzure } = require('../private/download-from-azure');
const { CONSTANTS } = require('../helpers/constant');
const { get: _get, isEqual: _isEqual, orderBy: _orderBy, has: _has, isEmpty: _isEmpty, isEmpty, reduce: _reduce } = require('lodash');
const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const JSONStream = require('JSONStream');
const es = require('event-stream');
const { projectFindOne, projectFind, saveProject, updateProject, findProjectUsingQuery, projectAggregation } = require('../models/project');
const { saveProjectOutput } = require('../models/projectOutput');
const { projectExecutionFindOne, projectExecutionFind, saveProjectExecution, updateProjectExecution } = require('../models/projectExecution');
const { projectExecutionAdminFind } = require('../models/projectExecutionsAdmin');
const { cleanEntityData } = require('../helpers/commonUtils');
const { userFindOne, userFind, saveUser, updateUser } = require('../models/user');
const { mapProjectData, mapProjectResponse, mapAutoConfigData, mapProjectDropdowns, mapProjectOverviewResponse, mapAdminProjectOverviewResponse,mapProvenanceProjectResponse } = require('../mappers/project');
const { mapProjectExecutionData, mapProjectExecutionResponse, mapAddExecutionData, mapLatestExecutionResponse } = require('../mappers/projectExecution');
const { exec } = require('child_process');
const { projectQuery, projectAggregationQuery, projectUserAggregationQuery, acProjectAggregationQuery, adminProjectUserAggregationQuery, adminProjectAggregationQuery } = require('../queryBuilder/project');

const { projectExecAdaptor, xaiRunAdaptor } = require('../adaptors/airFlow');
    
const { projectAdminAggregation, projectAdminFind } = require('../models/projectsAdmin');
const { adminMetaDataAggregation } = require('../models/adminMetaData');
const { rollbackCreateProject } = require('../rollback/project');
const { GATEWAY_TIMEOUT } = require('http-status-codes');

// 100k as input parameter
const maxRows = 100001;
const maxCols = 25;
const topTen = 10;

const validateRows = {
    [`${_get(CONSTANTS, 'fileType.csv')}`]: ({ file }) => new Promise((resolve, reject) => {
            let rowsCount = 0;
            const start = Date.now();
            console.log('starting timer');
            csv.parseFile(file.path, { headers: true, maxRows })
                .on("data", function(data) {
                    rowsCount++;
                })
                .on("end", function() {
                    const millis = Date.now() - start;
                    console.log(`milliseconds elapsed csv validate = ${millis}`);
                    return resolve(rowsCount);
                });
        })
        .catch(err => { throw (err) }),
    [`${_get(CONSTANTS, 'fileType.excel')}`]: ({ file }) => new Promise((resolve, reject) => {
            let rowsCount = 0;
            csv.parseFile(file.path, { headers: true, maxRows })
                .on("data", function(data) {
                    rowsCount++;
                })
                .on("end", function() {
                    return resolve(rowsCount);
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

        let i = 0;

        const exec = () => new Promise((resolve, reject) => {
            getStream()
                .pipe(es.mapSync(function(data) {
                    i++;
                    if (i === maxRows) {
                        return resolve(i);
                    }
                }))
                .on('end', () => {
                    resolve(i);
                });
        })

        jsonData = await exec();
        // fs.unlinkSync(file.path); // remove uploaded file
        return i;
    }
}
const readFile = {
    [`${_get(CONSTANTS, 'fileType.csv')}`]: ({ file }) => new Promise((resolve, reject) => {
            const fileRows = [];
            csv.parseFile(file.path, { headers: true, maxRows: topTen })
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
    [`${_get(CONSTANTS, 'fileType.excel')}`]: ({ file }) => new Promise((resolve, reject) => {
            const fileRows = [];
            csv.parseFile(file.path, { headers: true, maxRows: topTen })
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

        let i = 0;

        const exec = () => new Promise((resolve, reject) => {
            getStream()
                .pipe(es.mapSync(function(data) {
                    if (i < topTen) {
                        jsonData.push(data);
                        // console.log(data);
                    }
                    if (i === topTen) {
                        return resolve(jsonData);
                    }
                    i++;
                }));
        })

        jsonData = await exec();
        fs.unlinkSync(file.path); // remove uploaded file
        return jsonData;
    }
}
const projectFileHeaderHelper = async({ body, file }) => {
    // testing here
    // saveAzure({file});

    const r = readFile[_get(file, 'mimetype')];
    const response = await r({ file });


    // return { content: response };
    return { content: response };

};
const projectFileHeaderHandler = async options => baseHandler(projectFileHeaderHelper, options);

const readHeaderFor = {
    [`${_get(CONSTANTS, 'fileType.csv')}`]: ({ file }) => new Promise((resolve, reject) => {
            const fileRows = [];
            csv.parseFile(file.path, { headers: true, maxRows: 1 })
                .on("data", function(data) {
                    fileRows.push(data); // push each row
                    console.log(data);
                })
                .on("end", function() {
                    fs.unlinkSync(file.path); // remove uploaded file
                    return resolve(fileRows);
                });
        })
        .catch(err => { throw (err) }),
    [`${_get(CONSTANTS, 'fileType.excel')}`]: ({ file }) => new Promise((resolve, reject) => {
            const fileRows = [];
            csv.parseFile(file.path, { headers: true, maxRows: 1 })
                .on("data", function(data) {
                    fileRows.push(data); // push each row
                    console.log(data);
                })
                .on("end", function() {
                    fs.unlinkSync(file.path); // remove uploaded file
                    return resolve(fileRows);
                });
        })
        .catch(err => { throw (err) }),
    [`${_get(CONSTANTS, 'fileType.json')}`]: async({ file }) => {
        let jsonData = []
        const getStream = function() {
            const stream = fs.createReadStream(file.path, { encoding: 'utf8' });
            const parser = JSONStream.parse('*');
            return stream.pipe(parser);
        };

        let i = 0;

        const exec = () => new Promise((resolve, reject) => {
            getStream()
                .pipe(es.mapSync(function(data) {
                    if (i < 1) {
                        jsonData.push(data);
                        console.log(data);
                    }
                    if (i === 1) {
                        return resolve(jsonData);
                    }
                    i++;
                }));
        })

        jsonData = await exec();
        fs.unlinkSync(file.path); // remove uploaded file
        return jsonData;
    }
}
const projectCSVJSONFileHeaderHelper = async({ file }) => {
    const v = validateRows[_get(file, 'mimetype')];
    const rowsCount = await v({ file });
    console.log("rowsCount: ", rowsCount);
    let rowValidation = true;
    if (rowsCount > 100000) {
        rowValidation = false;
    }

    const r = readHeaderFor[_get(file, 'mimetype')];
    const [response] = await r({ file });
    
    console.log("response is: ", response)
    let fields = [];
    for (const [key, value] of Object.entries(response)) {
        let field = {
                name: key,
                defaultType: typeof value
            }
            // console.log(`${key}: ${value}`);
        fields.push(field);
    }
    let colValidation = true;
    if (fields.length > maxCols) {
        colValidation = false;
    }
    console.log('columns count: ', fields.length);
    // const fields = Object.keys(response)
    finalResponse = {
        rowValidation,
        colValidation,
        fields,
        datatypes: ['str', 'int', 'float', 'complex', 'list', 'tuple', 'range', 'dict', 'set', 'frozenset', 'bool', 'bytes', 'bytearray', 'memoryview']
    }
    console.log('final response is: ', finalResponse)
    return { content: finalResponse };
};
const projectCSVJSONFileHeaderHandler = async options => baseHandler(projectCSVJSONFileHeaderHelper, options);

const saveToAzureHelper = async({ user, body, files }) => {
    const fileUrlsArray = await Promise.all(Object.values(files).map(async(item) => await saveAzure({ file: item[0], user })))
        // console.log("fileUrls are: ", fileUrlsArray);
        // convert fileUrlsArray into object
        // fileUrlsArray:  [
        //     { train: 'input-files/Aishwarya/faithful_1611214131826.csv' },
        //     { test: 'input-files/Aishwarya/grades_1611214131835.csv' },
        //     { model: 'input-files/Aishwarya/ford_escort_1611214131836.csv' }
        //   ]
        // to
        // {
        //     train: "...",
        //     test: "...",
        //     model: "..."
        // }
    const fileUrlsObj = fileUrlsArray.reduce(function(result, item) {
        var key = Object.keys(item)[0]; //first property: a, b, c
        result[key] = item[key];
        return result;
    }, {});

    // unlink to remove files from uploads folder
    Object.values(files).map(item => fs.unlinkSync(item[0].path));
    return fileUrlsObj;
}

const projectCreationHelper = async({ userId, body, files }) => {

    const user = await userFindOne({ _id: userId });
    // const username = _get(user, 'name', userId)
    //save files (training data, testing data, model data) to azure before cosmos DB operation complete
    // execution stops here if error occurs while uploading file to azure container, so that cosmos DB operation is avoided
    const fileUrlsObj = await saveToAzureHelper({ user, body, files });
    // console.log('fileUrlsObj: ', fileUrlsObj);

    // console.log('body contains test and train? ', body)
    body = {
        ...body,
        explainability: JSON.parse(_get(body, 'explainability', '{}'))
    }
    // console.log('body after parsing: ', body);
    // console.log('body categoricalFeatures after parsing: ', body.explainability.testDataTargetVars.categoricalFeatures);

    const projectData = mapProjectData({ data: {...body, userId, fileUrlsObj } })

    // creating global variable so that it can be used in catch block

    let projectResponse;
    let projectExecResponse;
    let projectOutputResponse;
    try {


        projectResponse = await saveProject({ data: projectData })
        // console.log('projectResponse: ', projectResponse)

        
        let projectExecutionData = mapProjectExecutionData({ data: {...body, userId, fileUrlsObj } });
        // console.log("projectExecutionData: ", projectExecutionData)
        projectExecutionData = {
            ...projectExecutionData,
            projectId: _get(projectResponse, '_id'),
        }

        projectExecResponse = await saveProjectExecution({ data: projectExecutionData })
        // console.log('projectExecResponse: ', projectExecResponse)

        let projectOutputInsertData = {
            projectId: _get(projectResponse, '_id'),
            execId: _get(projectExecResponse, '_id'),
            createdBy: userId
        }
        // console.log("projectOutputInsertData: ", projectOutputInsertData);
        projectOutputResponse = await saveProjectOutput({ data: projectOutputInsertData })
        // console.log("projectOutputResponse: ", projectOutputResponse)

        const response = cleanEntityData({
                ...mapProjectResponse({ data: projectResponse }),
                ...mapProjectExecutionResponse({ data: projectExecResponse })
            })
            // clean response before returning
            // console.log('response is: ', response)
        if (_get(body, 'executionType').includes('drift')) {
            const dagData = cleanEntityData({
                trainFilePath: _get(fileUrlsObj, 'train'),
                testFilePath: _get(fileUrlsObj, 'test'),
                target: _get(projectExecResponse, 'explainability.testDataTargetVars.label'),
                projectId: _get(projectResponse, '_id'),
                execId: _get(projectExecResponse, '_id'),
                userEmail: _get(user, "email"),
                userId,
            });
            console.log('logging dag drift data', dagData);
            const dagResponse = await projectExecAdaptor({ data: dagData });
        }
        
        if (_get(body, 'executionType').includes('explainability')) {
            let class_names = _get(projectExecResponse, 'explainability.testDataTargetVars.classNames')
            if (class_names) {
                class_names = class_names.split(',').map(item => item.trim())
            } else {
                class_names = 'null';
            }
            let categorical_features = _get(projectExecResponse, 'explainability.testDataTargetVars.categoricalFeatures')
            if (_isEmpty(categorical_features)) {
                categorical_features = 'null';
            }
            const xaiData = cleanEntityData({
                execId: _get(projectExecResponse, '_id'),
                projectId: _get(projectResponse, '_id'),
                test_file: _get(fileUrlsObj, 'test'),
                pickle_file: _get(fileUrlsObj, 'model'),
                mode: _get(projectResponse, 'modelType'),
                categorical_features,
                target_column: _get(projectExecResponse, 'explainability.testDataTargetVars.label'),
                class_names,
                userEmail: _get(user, "email"),
                userId,
            });
            console.log('logging xai dag data', xaiData);
            const xaiResponse = await xaiRunAdaptor({ data: xaiData });
            console.log("xaiResponse is: ", xaiResponse)
        }
        return { content: response };
    }
    catch(err) {
        
        const data = cleanEntityData({
            projectRes: projectResponse,
            projectExecRes: projectExecResponse,
            projectOutputRes: projectOutputResponse
        });
        rollbackCreateProject({ data });
        throw err;

    }

    
}
const projectCreationHandler = async options => baseHandler(projectCreationHelper, options);

const addExecHelper = async({ userId, body, files }) => {

    const user = await userFindOne({ _id: userId });
    const fileUrlsObj = await saveToAzureHelper({ user, body, files });
    console.log('fileUrlsObj in addExec: ', fileUrlsObj);

    console.log("body is", body)
    const execFound = await projectExecutionFindOne({ _id: _get(body, 'execId') })
    console.log("execFound is: ", execFound)
    const projectId = _get(execFound, "projectId");
    const foundProject = await projectFindOne({ _id: projectId });
    console.log("foundProject is", foundProject)
    const projectUpdateQuery = cleanEntityData({
        _id: projectId
    });
    const projectUpdateData = {
        $push: cleanEntityData({ 
            trainFiles: { url: fileUrlsObj.train },
            testFiles: { url: fileUrlsObj.test }
        })
    }
    await updateProject({ query: projectUpdateQuery, data: projectUpdateData })

    let addExecutionData = mapAddExecutionData({ data: { execFound, foundProject, userId, fileUrlsObj, body } });
    const projectExecResponse = await saveProjectExecution({ data: addExecutionData })
    console.log('projectExecResponse is: ', projectExecResponse);

    let projectOutputInsertData = {
        projectId,
        execId: _get(projectExecResponse, '_id'),
        createdBy: userId
    }
    console.log("projectOutputInsertData: ", projectOutputInsertData);
    const projectOutputResponse = await saveProjectOutput({ data: projectOutputInsertData })
    console.log("projectOutputResponse: ", projectOutputResponse)

    let dagResponse, xaiResponse;
    if (_get(execFound, "executionType").includes('drift')) {
        const dagData = cleanEntityData({
            trainFilePath: _get(projectExecResponse, 'trainFile'),
            testFilePath: _get(projectExecResponse, 'testFile'),
            target: _get(execFound, 'explainability.testDataTargetVars.label'), // change to test
            projectId: _get(execFound, 'projectId'),
            execId: _get(projectExecResponse, '_id'),
            userEmail: _get(user, "email"),
            userId,
        });
        console.log('logging dag data', dagData);
        dagResponse = await projectExecAdaptor({ data: dagData });
    }

    if (_get(execFound, "executionType").includes('explainability')) {
        let class_names = _get(projectExecResponse, 'explainability.testDataTargetVars.classNames')
        if (class_names) {
            class_names = class_names.split(',').map(item => item.trim())
        } else {
            class_names = 'null';
        }
        let categorical_features = _get(projectExecResponse, 'explainability.testDataTargetVars.categoricalFeatures')
        if (_isEmpty(categorical_features)) {
            categorical_features = 'null';
        }
        const xaiData = cleanEntityData({
            execId: _get(projectExecResponse, '_id'),
            projectId: _get(execFound, 'projectId'),
            test_file: _get(projectExecResponse, 'testFile'),
            pickle_file: _get(projectExecResponse, 'modelFile'),
            mode: _get(foundProject, 'modelType'),
            categorical_features,
            target_column: _get(execFound, 'explainability.testDataTargetVars.label'),
            class_names,
            userEmail: _get(user, "email"),
            userId,
        });
        console.log('logging xai data', xaiData);
        xaiResponse = await xaiRunAdaptor({ data: xaiData });
        console.log("xaiResponse is: ", xaiResponse)
    }

    const response = cleanEntityData({
        dagResponse,
        xaiResponse
    })

    return { content: response };
}
const addExecHandler = async options => baseHandler(addExecHelper, options);

const autoConfigProjectExecDetailsFetchHelper = async({ userId, body }) => {
    const user = await userFindOne({ _id: userId });
    // const username = _get(user, 'name', userId)

    return { content: { message: 'success' } };
}

const autoConfigProjectExecDetailsFetchHandler = async options => baseHandler(autoConfigProjectExecDetailsFetchHelper, options);

const fetchProjectDataHelper = {
    "admin": async ({ data }) => {
        const query = adminProjectUserAggregationQuery({ userId: _get(data, 'userId'), filterByProjectName: _get(data, 'filterByProjectName'), startDate: _get(data, 'startDate'), endDate: _get(data, 'endDate'), driftByPercentage: _get(data, 'driftByPercentage'), creatorType: _get(data, 'creatorType') })
        let projects = await projectAdminAggregation(query);

        // removing rossmann-store
        const finalProjects = _reduce(projects, (acc, val) => {
            if (_get(val, 'name') !== "Rossmann") {
              acc.push(val);  
            };
            return acc;
        }, []);
        return finalProjects;
    },
    "both": async ({ data }) => {
        console.log("Projects",data);
        const adminQuery = adminProjectUserAggregationQuery({ userId: _get(data, 'userId'),model:_get(data,'model'), filterByProjectName: _get(data, 'filterByProjectName'), startDate: _get(data, 'startDate'), endDate: _get(data, 'endDate'), driftByPercentage: _get(data, 'driftByPercentage'), creatorType: _get(data, 'creatorType') })
        console.log(adminQuery);
        let adminProjects = await projectAdminAggregation(adminQuery);

        // removing rossmann-store
        const finalAdminProjects = _reduce(adminProjects, (acc, val) => {
            if (_get(val, 'name') !== "Rossmann") {
              acc.push(val);  
            };
            return acc;
        }, []);

        const nonAdminQuery = projectUserAggregationQuery({ userId: _get(data, 'userId'),model:_get(data,'model'), filterByProjectName: _get(data, 'filterByProjectName'), startDate: _get(data, 'startDate'), endDate: _get(data, 'endDate'), driftByPercentage: _get(data, 'driftByPercentage'), creatorType: _get(data, 'creatorType') })
        let nonAdminProjects = await projectAggregation(nonAdminQuery);

        let projects = [...finalAdminProjects, ...nonAdminProjects];
        
        // console.log("projects are: ", projects)
        // console.log("nonAdminProjects: ", nonAdminProjects);
        // console.log("adminProjects: ", finalAdminProjects);
        return projects;
    },
    "non-admin": async ({ data }) => {
        const query = projectUserAggregationQuery({ userId: _get(data, 'userId'), filterByProjectName: _get(data, 'filterByProjectName'), startDate: _get(data, 'startDate'), endDate: _get(data, 'endDate'), driftByPercentage: _get(data, 'driftByPercentage'), creatorType: _get(data, 'creatorType') })
        let projects = await projectAggregation(query);
        return projects;
    }
}
const fetchProjectsHelper = async({ userId,model }) => {
    
    console.log('projectData', userId,model);
    const userDetail = await userFindOne({ _id: userId });
    
    const query = {
        createdBy: _get(userDetail, 'email'),
        model :model
    };
    console.log(query);
    const projectData = await projectFind(query);
    console.log(projectData);
    const mappedData = mapProvenanceProjectResponse({ data: projectData });
    response = {
        projects: mappedData
    };

    return { content: response };
}


// const fetchProjectsHelper = async({ userId, filterByProjectName, startDate, endDate, driftByPercentage, creatorType }) => {
//     let data = cleanEntityData({
//         userId,
//         filterByProjectName,
//         startDate,
//         endDate,
//         driftByPercentage,
//         creatorType
//     });
//     const fetchHelper = fetchProjectDataHelper[creatorType];
//     let projects = await fetchHelper({ data });
    
//     // filter applied here, try in aggregation
//     if (driftByPercentage) {
//         projects = projects.filter(project => _has(project, "output") && _get(project, "output.drift_output.overall_drift_value") > driftByPercentage/100);
//         // console.log('projects after drift percentage filter are: ', projects);
//     }

//     projects = projects.map(project => {
//         project = mapProjectOverviewResponse({ data: project })
//         return {
//             ...project,
//             "error": "0"
//         }
//     })

//     // start and end date filter on runStart and runEnd
//     if (_get(data, 'startDate')) {
//         projects = projects.filter(project => project.runStart >= new Date(_get(data, 'startDate')))
//     }
//     if (_get(data, 'endDate')) {
//         const endDateTillDayEnd = new Date(_get(data, 'endDate'));
//         endDateTillDayEnd.setDate(endDateTillDayEnd.getDate() + parseInt(1));
//         projects = projects.filter(project => project.runEnd < endDateTillDayEnd)
//     }
    
//     driftGT30 = projects.filter(project => _get(project, "drift") > 0.30).length;
//     driftCount = projects.filter(project => _get(project, "executionType", []).includes('drift')).length;
//     xaiCount = projects.filter(project => _get(project, "executionType", []).includes('explainability')).length;
//     totalCount = projects.length;
    
//     const response = cleanEntityData({
//         totalCount,
//         projects,
//         driftGT30,
//         driftCount,
//         xaiCount,
//     });


//     return { content: response };
// }

const fetchProjectsHandler = async options => baseHandler(fetchProjectsHelper, options);

const fetchProjectDataModelsHelper = async() => {
    // Store somewhere in DB later, for now hardcoded
    const response = [
        { value: 'regression', viewValue: 'Regression' },
        { value: 'classification', viewValue: 'Classification' },
        // { value: 'time-series', viewValue: 'Time Series' },
    ]
    return { content: response };
}

const fetchProjectDataModelsHandler = async options => baseHandler(fetchProjectDataModelsHelper, options);

const projectAutoConfigHelper = async() => {
    const query = acProjectAggregationQuery()
    console.log("Proj",);
    let projects = await projectAggregation(query);
    console.log('projects in projectAutoConfigHelper: ', projects);
    const response = mapAutoConfigData({ data: projects })
    return { content: response };
}

const projectAutoConfigHandler = async options => baseHandler(projectAutoConfigHelper, options);

const projectFileHeaderSaveHelper = async({ body }) => {
    // let projectExecutionData = mapProjectExecutionData({ data: body });
    // projectExecutionData = {
    //     ...projectExecutionData,
    // }
    const projectExecResponse = await saveProjectExecution({ data: body })
    console.log('projectExecResponse: ', projectExecResponse)

    return { content: projectExecResponse };
}
const projectFileHeaderSaveHandler = async options => baseHandler(projectFileHeaderSaveHelper, options);

const projectDropdownHelper = async({ userId }) => {
    const query = projectQuery({ userId });
    const nonAdminProjects = await findProjectUsingQuery(query);
    const adminProjects = await projectAdminFind();

    // removing rossmann-store
    const finalAdminProjects = _reduce(adminProjects, (acc, val) => {
        if (_get(val, 'name') !== "Rossmann") {
          acc.push(val);  
        };
        return acc;
    }, []);
    const projects = [ ...finalAdminProjects, ...nonAdminProjects ];
   // console.log("adminprojects: ", adminProjects)
    const projectDropdowns = mapProjectDropdowns({ data: projects });
    return { content: projectDropdowns };
}
const projectDropdownHandler = async options => baseHandler(projectDropdownHelper, options);

const projectUserHelper = async({ userId }) => {
    const query = projectQuery({ userId });
    const nonAdminProject = await projectFindOne(query);
    let response = {
        newUser: 'y'
    }
    if(!isEmpty(nonAdminProject)) {
        response.newUser = 'n';
    }
    return { content:  response };
}
const projectUserHandler = async options => baseHandler(projectUserHelper, options);

const projectDetailsHelper = async({ userId, projectId }) => {
    const projectFound = await projectFindOne( { _id: projectId });
    // console.log("projectFound in details project: ", projectFound);
    if (projectFound) {
        const query = projectAggregationQuery({ userId, projectId });
        const projects = await projectAggregation(query);
        return { content: projects };
    } else {
        const query = adminProjectAggregationQuery({ projectId });
        const projects = await projectAdminAggregation(query);
        // console.log("projectDetailsHelper: ", projects)
        return { content: projects };
    }
}

const projectDetailsHandler = async options => baseHandler(projectDetailsHelper, options);

const projectLatestExecDetailsHelper = async({ userId, projectId }) => {
    const projectFound = await projectFindOne( { _id: projectId });

    if (projectFound) {
        let project = await projectExecutionFind({projectId});
        project = mapLatestExecutionResponse({data: project[project.length-1]});
        return { content: project };
    } else {
        let project = await projectExecutionAdminFind({projectId});
        project = mapLatestExecutionResponse({data: project[project.length-1]});
        return { content: project };
    }
}

const projectLatestExecDetailsHandler = async options => baseHandler(projectLatestExecDetailsHelper, options);

const fileDownloadHelper = async({ userId, body, res }) => {
    const blobName = _get(body, 'name');
    // console.log('blobname is: ', blobName)
    const fileName = await downloadFromAzure({ blobName })

    const filePath = path.join(__dirname, '../../', fileName);
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': stat.size
    });

    const readStream = fs.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);

    readStream.on('error', (err) => {
        console.log('Error in read stream...', err);
    });
    res.on('error', (err) => {
        console.log('Error in write stream...', err);
    });

    readStream.on('end', () => {

        // console.log('All the data is being consumed.');
        fs.unlinkSync(filePath);

    });

    // return { content: readStream}
}
const fileDownloadHandler = async options => baseHandler(fileDownloadHelper, options);

const uniqueProjectNameHelper = async ({ projectName, userId }) => {
    const response  = await projectFindOne({ name: projectName, createdBy: userId });
    let finalResponse = {
        code: 1,
        message: "ok"
    }
    if (!_isEmpty(response)) {
        finalResponse = {
            code: -1,
            message: "Project already exists"
        };
    }
    return { content: finalResponse };
}

const uniqueProjectNameHandler = async options => baseHandler(uniqueProjectNameHelper, options);

const fileViewHelper = async ({ body }) => {
    const blobName = _get(body, 'name');
    // console.log('blobname is: ', blobName)
    const fileName = await downloadFromAzure({ blobName })

    const filePath = path.join(__dirname, '../../', fileName);

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
    // fs.unlinkSync(filePath);

    const r = readFile[mimetype];
    const file = {
        path: filePath
    };
    const response = await r({ file });
    return { content: { fileData: response}};
}

const fileViewHandler = async options => baseHandler(fileViewHelper, options);

module.exports = {
    projectFileHeaderHandler,
    projectCreationHandler,
    fetchProjectsHandler,
    projectCSVJSONFileHeaderHandler,
    fetchProjectDataModelsHandler,
    projectAutoConfigHandler,
    projectFileHeaderSaveHandler,
    projectDropdownHandler,
    projectDetailsHandler,
    fileDownloadHandler,
    addExecHandler,
    uniqueProjectNameHandler,
    fileViewHandler,
    projectUserHandler,
    projectLatestExecDetailsHandler
}