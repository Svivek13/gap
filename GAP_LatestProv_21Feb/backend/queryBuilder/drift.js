const mongoose = require('mongoose');
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const ObjectId = mongoose.Types.ObjectId;

const mapDriftReqQuery = ({ projectId, execTill, limit }) => {
    const matchQuery = {
        projectId: ObjectId(projectId)
    };
    let execMatchQuery = {};
    if (execTill) {
        execMatchQuery = { 
            "executions.createdAt": { $lte: new Date(execTill) } 
        }
    }
    return [
        {
            $match: matchQuery
        },
        {
            $lookup:
            {
              from: `${_get(CONSTANTS, 'collectionName.projectExecutions')}`,
              localField: "execId",
              foreignField: "_id",
              as: "executions"
            }
        },
        { $unwind : "$executions" },
        { 
            $match: { 
                $and: [
                    { "executions.driftexecutionTime.status": 'Success' },
                    execMatchQuery
                ]
        }
        },
        // {
        //     $sort: { updatedAt: -1 }
        // },
        {
            $limit: limit
        }
    ];
};

const mapAdminDriftReqQuery = ({ projectId, execTill, limit }) => {
    const matchQuery = {
        projectId: ObjectId(projectId)
    };
    let execMatchQuery = {};
    if (execTill) {
        execMatchQuery = { 
            "executions.createdAt": { $lte: new Date(execTill) } 
        }
    }
    return [
        {
            $match: matchQuery
        },
        {
            $lookup:
            {
              from: `${_get(CONSTANTS, 'collectionName.projectExecutionsAdmin')}`,
              localField: "execId",
              foreignField: "_id",
              as: "executions"
            }
        },
        { $unwind : "$executions" },
        { 
            $match: { 
                $and: [
                    { "executions.driftexecutionTime.status": 'Success' },
                    execMatchQuery
                ]
        }
        },
        // {
        //     $sort: { updatedAt: -1 }
        // },
        {
            $limit: limit
        }
    ];
};


module.exports = {
    mapDriftReqQuery,
    mapAdminDriftReqQuery
}