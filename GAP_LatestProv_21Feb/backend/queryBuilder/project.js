const { cleanEntityData } = require("../helpers/commonUtils");
const { get: _get, filter } = require('lodash');
const { CONSTANTS } = require('../helpers/constant');
const mongoose = require('mongoose');
const moment = require('moment');

const ObjectId = mongoose.Types.ObjectId;

const projectQuery = ({ userId }) => cleanEntityData({
    createdBy: ObjectId(userId),
});

const projectAggregationQuery = ({ userId, projectId }) => {
    const matchQuery = cleanEntityData({
        createdBy: ObjectId(userId),
        _id: ObjectId(projectId) // error here & test autoconfig flow UI, 
    });
    console.log('check', _get(CONSTANTS, 'collectionName.projectExecutions'));
    return [
        {
            $match: matchQuery
        },
        {
            $lookup:
            {
              from: `${_get(CONSTANTS, 'collectionName.projectExecutions')}`,
              localField: "_id",
              foreignField: "projectId",
              as: "exec"
            }
        },
        {
            $project: {
                status: 1,
                name: 1,
                description: 1,
                modelType: 1,
                createdBy: 1,
                trainFiles: 1,
                testFiles: 1,
                modelFile: 1,
                exec: {
                    _id: 1,
                    explainability: 1,
                    executionType: 1,
                    executionName: 1,
                    modelFile: 1,
                    trainFile: 1,
                    testFile: 1,
                    driftexecutionTime: {
                        status: 1,
                        start: 1,
                        end: 1,
                    },
                    xaiexecutionTime: {
                        status: 1,
                        start: 1,
                        end: 1,
                    },
                    createdBy: 1,
                    createdAt: 1
                }
            }
        },
        {
            $lookup:
            {
              from: `${_get(CONSTANTS, 'collectionName.users')}`,
              localField: "exec.createdBy",
              foreignField: "_id",
              as: "exec.user"
            }
        },
        {
            $project: {
                status: 1,
                name: 1,
                description: 1,
                modelType: 1,
                createdBy: 1,
                trainFiles: 1,
                testFiles: 1,
                modelFile: 1,
                exec: {
                    _id: 1,
                    explainability: 1,
                    executionType: 1,
                    executionName: 1,
                    modelFile: 1,
                    trainFile: 1,
                    testFile: 1,
                    driftexecutionTime: {
                        status: 1,
                        start: 1,
                        end: 1,
                    },
                    xaiexecutionTime: {
                        status: 1,
                        start: 1,
                        end: 1,
                    },
                    createdBy: 1,
                    createdAt: 1,
                    user: { $arrayElemAt: ["$exec.user.name", 0] },
                }
            }
        },
        // {
        //     $unwind: "$exec"
        // },
        {
            $sort: {"exec.createdAt": -1}
        }
        // {
        //     $lookup:
        //     {
        //       from: `${_get(CONSTANTS, 'collectionName.users')}`,
        //       localField: "exec.createdBy",
        //       foreignField: "_id",
        //       as: "user"
        //     }
        // },
        // {
        //     $unwind: "$user"
        // }
        // let not available in lookup in cosmos DB as of today 12th Feb, 21
        // { "$lookup": {
        //     "from": `${_get(CONSTANTS, 'collectionName.projectExecutions')}`,
        //     "let": { "id": "$_id" },
        //     "pipeline": [
        //       { "$match": { "$expr": { "$eq": ["$projectId", "$$id"] }}},
        //       { "$project": { "explainability": 1, "executionType": 1 }}
        //     ],
        //     "as": "exec"
        // }}
    ]
}
const adminProjectAggregationQuery = ({ projectId }) => {
    const matchQuery = cleanEntityData({
        _id: ObjectId(projectId) // error here & test autoconfig flow UI, 
    });
    return [
        {
            $match: matchQuery
        },
        {
            $lookup:
            {
              from: `${_get(CONSTANTS, 'collectionName.projectExecutionsAdmin')}`,
              localField: "_id",
              foreignField: "projectId",
              as: "exec"
            }
        },
        {
            $project: {
                status: 1,
                name: 1,
                description: 1,
                modelType: 1,
                createdBy: 1,
                trainFiles: 1,
                testFiles: 1,
                modelFile: 1,
                exec: {
                    _id: 1,
                    explainability: 1,
                    executionType: 1,
                    executionName: 1,
                    modelFile: 1,
                    trainFile: 1,
                    testFile: 1,
                    driftexecutionTime: {
                        status: 1,
                        start: 1,
                        end: 1,
                    },
                    xaiexecutionTime: {
                        status: 1,
                        start: 1,
                        end: 1,
                    },
                    createdBy: 1,
                    createdAt: 1
                }
            }
        },
        {
            $lookup:
            {
              from: `${_get(CONSTANTS, 'collectionName.users')}`,
              localField: "exec.createdBy",
              foreignField: "_id",
              as: "exec.user"
            }
        },
        {
            $project: {
                status: 1,
                name: 1,
                description: 1,
                modelType: 1,
                createdBy: 1,
                trainFiles: 1,
                testFiles: 1,
                modelFile: 1,
                exec: {
                    _id: 1,
                    explainability: 1,
                    executionType: 1,
                    executionName: 1,
                    modelFile: 1,
                    trainFile: 1,
                    testFile: 1,
                    driftexecutionTime: {
                        status: 1,
                        start: 1,
                        end: 1,
                    },
                    xaiexecutionTime: {
                        status: 1,
                        start: 1,
                        end: 1,
                    },
                    createdBy: 1,
                    createdAt: 1,
                    user: { $arrayElemAt: ["$exec.user.name", 0] },
                }
            }
        },
        // {
        //     $unwind: "$exec"
        // },
        {
            $sort: {"exec.createdAt": -1}
        }
        // {
        //     $lookup:
        //     {
        //       from: `${_get(CONSTANTS, 'collectionName.users')}`,
        //       localField: "exec.createdBy",
        //       foreignField: "_id",
        //       as: "user"
        //     }
        // },
        // {
        //     $unwind: "$user"
        // }
        // let not available in lookup in cosmos DB as of today 12th Feb, 21
        // { "$lookup": {
        //     "from": `${_get(CONSTANTS, 'collectionName.projectExecutions')}`,
        //     "let": { "id": "$_id" },
        //     "pipeline": [
        //       { "$match": { "$expr": { "$eq": ["$projectId", "$$id"] }}},
        //       { "$project": { "explainability": 1, "executionType": 1 }}
        //     ],
        //     "as": "exec"
        // }}
    ]
}

const projectUserAggregationQuery = ({ userId, filterByProjectName, startDate, endDate, driftByPercentage, creatorType }) => {
    // startDate, endDate parameters not required anymore. That filtering is happening in handler itself before sending response
    const matchQuery = cleanEntityData({
        createdBy: ObjectId(userId),
    });
    let matchProjectName = {};
    if (filterByProjectName) {
        matchProjectName = {
            ...matchProjectName,
            name: { $regex: filterByProjectName, $options: 'i' }
        }
    }
    let matchStartDate = {};
    if (startDate) {
        matchStartDate = {
            ...matchStartDate,
            createdAt: { $gte: new Date(startDate) }
        }
    }
    let matchEndDate = {};
    if (endDate) {
        // if user selects end date as 9th Feb, we return data till 9th Feb 23:59 hours
        const endDateTillDayEnd = new Date(endDate);
        endDateTillDayEnd.setDate(endDateTillDayEnd.getDate() + parseInt(1));
        matchEndDate = {
            ...matchEndDate,
            createdAt: { $lt: endDateTillDayEnd }
        }
    }
    return [
        {
            $match: {
                $and: [ matchQuery, matchProjectName ]
            }
        },
        {
            $lookup:
            {
              from: `${_get(CONSTANTS, 'collectionName.users')}`,
              localField: "createdBy",
              foreignField: "_id",
              as: "user"
            },
            
        },
        {
            $project: {
                user: { $arrayElemAt: ["$user.name", 0] },
                name: 1,
                createdAt: 1
            }
        },
        {
            $lookup:
            {
              from: `${_get(CONSTANTS, 'collectionName.projectExecutions')}`,
              localField: "_id",
              foreignField: "projectId",
              as: "exec"
            }
        },
        {
            $project: {
                exec: { $arrayElemAt: ["$exec", -1] },
                name: 1,
                user: 1,
                createdAt: 1
            }
        },
        // {
        //     $unwind: "$exec"
        // },
        {
            $lookup:
            {
              from: `${_get(CONSTANTS, 'collectionName.projectOutputs')}`,
              localField: "exec._id",
              foreignField: "execId",
              as: "output"
            }
        },
        // {
        //     $unwind: "$output"
        // },
        {
            $project: {
                user: 1,
                name: 1,
                exec: 1,
                output: { $arrayElemAt: ["$output", 0] },
                createdAt: 1
            }
        },
        // {
        //     $match: {
        //         output.drift_output.overall_drift_wtd: { $gte: 0.20 }
        //     }
        // },
        // {
        //     $lookup:
        //     {
        //       from: `${_get(CONSTANTS, 'collectionName.projectOutputs')}`,
        //       pipeline: [
        //          { $match:
        //             { $expr:
        //                 { $gte: [ "$drift_output.overall_drift_wtd", driftByPercentage/100 ] }
        //             }
        //          },
        //          { $project: { projectId: 0, _id: 0 } }
        //       ],
        //       as: "output"
        //     }
        // },
        // {
        //     "$addFields": {
        //         "output": {
        //             "$arrayElemAt": [
        //                 {
        //                     "$filter": {
        //                         "input": "$output",
        //                         "as": "newOutput",
        //                         "cond": {
        //                             "$gte": [ "$$newOutput.drift_output.overall_drift_wtd", driftByPercentage/100 ]
        //                         }
        //                     }
        //                 }, 0
        //             ]
        //         }
        //     }
        // },
        // {
        { 
            $sort: { 
                createdAt: -1 
            } 
        }
    ]
}


const adminProjectUserAggregationQuery = ({ userId,model, filterByProjectName, startDate, endDate, driftByPercentage, creatorType }) => {
    // startDate, endDate parameters not required anymore. That filtering is happening in handler itself before sending response
    
    // console.log('checing drift: ', driftByPercentage/100)
    // const matchQuery = cleanEntityData({
    //     type: 'project',
    // });
    let matchProjectName = {};
    if (filterByProjectName) {
        matchProjectName = {
            ...matchProjectName,
            name: { $regex: filterByProjectName, $options: 'i' }
        }
    }
    // let matchCreatorType = {};
    // if (creatorType && creatorType !== 'both') {
    //     matchCreatorType = {
    //         ...matchCreatorType,
    //         projectType: { $regex: creatorType, $options: 'i' }
    //     }
    // }
    let matchStartDate = {};
    if (startDate) {
        matchStartDate = {
            ...matchStartDate,
            createdAt: { $gte: new Date(startDate) }
        }
    }
    let matchEndDate = {};
    if (endDate) {
        // if user selects end date as 9th Feb, we return data till 9th Feb 23:59 hours
        const endDateTillDayEnd = new Date(endDate);
        endDateTillDayEnd.setDate(endDateTillDayEnd.getDate() + parseInt(1));
        matchEndDate = {
            ...matchEndDate,
            createdAt: { $lt: endDateTillDayEnd }
        }
    }
    return [
        {
            $match: {
                $and: [ matchProjectName ]
            }
        },
       
        
        // {
        //     $lookup:
        //     {
        //       from: `${_get(CONSTANTS, 'collectionName.users')}`,
        //       localField: "createdBy",
        //       foreignField: "_id",
        //       as: "user"
        //     },
            
        // },
        {
            $project: {
                // user: { $arrayElemAt: ["$user.name", 0] },
                name: 1,
                createdAt: 1
                // "properties.name": 1,
                // "properties.createdAt": 1
            }
        },
        {
            $lookup:
            {
              from: `${_get(CONSTANTS, 'collectionName.projectExecutionsAdmin')}`,
              localField: "_id",
              foreignField: "projectId",
              as: "exec"
            }
        },
        {
            $project: {
                exec: { $arrayElemAt: ["$exec", -1] },
                // "properties.name": 1,
                
                // "properties.createdAt": 1
                name: 1,
                createdAt: 1,
            }
        },
        
        {
            $lookup:
            {
              from: `${_get(CONSTANTS, 'collectionName.projectOutputsAdmin')}`,
              localField: "exec._id",
              foreignField: "execId",
              as: "output"
            }
        },
        
        {
            $project: {
                // "properties.name": 1,
                
                // "properties.createdAt": 1,
                name: 1,
                createdAt: 1,
                exec: 1,
                output: { $arrayElemAt: ["$output", 0] },
                
            }
        },
        
        { 
            $sort: { 
                createdAt: -1 
            } 
        }
    ]
}
const acProjectAggregationQuery = () => {
    return [
        {
            $match: {
                "projectType": 'admin'
            }
        },
        // {
        //     $lookup:
        //     {
        //       from: `${_get(CONSTANTS, 'collectionName.users')}`,
        //       localField: "createdBy",
        //       foreignField: "_id",
        //       as: "user"
        //     }
        // },
        // {
        //     $match: {
        //         "user.role": 'admin'
        //     }
        // },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                modelType: 1,
                modelFile: 1,
                trainFiles: 1,
                testFiles: 1
            }
        },
        {
            $lookup:
            {
              from: `${_get(CONSTANTS, 'collectionName.projectExecutions')}`,
              localField: "_id",
              foreignField: "projectId",
              as: "executions"
            }
        },
        { 
            $sort: { 
                createdAt: -1 
            } 
        }
    ]
}

const pipelineProjectQuery = ({ data }) => cleanEntityData({
    _id: _get(data, 'projectId')
});


module.exports = {
    projectQuery,
    projectAggregationQuery,
    projectUserAggregationQuery,
    acProjectAggregationQuery,
    pipelineProjectQuery,
    adminProjectUserAggregationQuery,
    adminProjectAggregationQuery
}