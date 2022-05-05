const mongoose = require('mongoose');
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const ObjectId = mongoose.Types.ObjectId;

const mapXaiReqQuery = ({ projectId }) => {
    const matchProjectId = {
        projectId: ObjectId(projectId)
    };
    return [
        {
            $match: matchProjectId
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
                "executions.xaiexecutionTime.status": 'Success'
            }
        },
        {
            $sort: { updatedAt: -1 }
        },
        {
            $limit: 1
        }
    ];
};
const mapAdminXaiReqQuery = ({ projectId }) => {
    const matchProjectId = {
        projectId: ObjectId(projectId)
    };
    return [
        {
            $match: matchProjectId
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
                "executions.xaiexecutionTime.status": 'Success'
            }
        },
        {
            $sort: { updatedAt: -1 }
        },
        {
            $limit: 1
        }
    ];
};
const mapXaiScatterPlotReqQuery = ({ projectId }) => {
    const matchProjectId = {
        projectId: ObjectId(projectId)
    };
    return [
        {
            $match: matchProjectId
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
                "executions.xaiexecutionTime.status": 'Success'
            }
        },
        {
            $sort: { updatedAt: -1 }
        },
        {
            $limit: 1
        }
    ];
};


module.exports = {
    mapXaiReqQuery,
    mapXaiScatterPlotReqQuery,
    mapAdminXaiReqQuery
}