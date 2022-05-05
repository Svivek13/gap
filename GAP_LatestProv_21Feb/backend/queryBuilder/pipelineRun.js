const { cleanEntityData } = require('../helpers/commonUtils');
const { get: _get, isEmpty: _isEmpty } = require('lodash');
const moment = require('moment');
const { CONSTANTS } = require('../helpers/constant');

const pipelineRunDropdownQuery = () => {
    return [
        {
            $lookup:
                 {
                   from: `${_get(CONSTANTS, 'collectionName.pipeline')}`,
                   localField: "pipelineId",
                   foreignField: "_id",
                   as: "pipelines_doc"
                 }
        },
        {"$unwind":"$pipelines_doc"},
        {"$match": {"pipelines_doc.parent": true}},
        {
            $group:
                {
                    _id:0,
                    pipelineName: {$addToSet: '$pipelineName'},
                    runStart: {$addToSet: '$runStart'},
                    runEnd: {$addToSet: '$runEnd'},
                    status: { $addToSet: '$status'}
            }
        }
    ]
};

const pipelineRunQuery = ({ data }) => cleanEntityData({
    _id: _get(data, 'id'),
    runId: _get(data, 'runId'),
    DBJobId: _get(data, 'dbJobId'),
});

const pipelineRunSearchQuery = () => {
    return [
        {
            $lookup:
                 {
                   from: `${_get(CONSTANTS, 'collectionName.pipeline')}`,
                   localField: "pipelineId",
                   foreignField: "_id",
                   as: "pipelines_doc"
                 }
        },
        {"$unwind":"$pipelines_doc"},
        {"$match": {"pipelines_doc.parent": true}},
        { $sort : { runStart : -1 } }
    ]
};


const mapProphetMiscAggregateQuery = ({ data, pipeline, limit, pipelineIds }) => {
    // const current = moment.utc().endOf('month').toISOString();
    // const previous = moment.utc().subtract(5, 'months').startOf('month').toISOString();
    const matchQuery = cleanEntityData({
        pipelineName: _get(pipeline, 'prophet_misc_metric_pipeline'),
        "metrics.country": _get(data, 'country'),
        runId: !_isEmpty(pipelineIds) ? { "$in": pipelineIds } : undefined,
        // "metrics.cutoffdate_qc": {
        //     '$gte': new Date(previous),
        //     '$lte': new Date(current)
        // }
    });
    return [
        {
            $match: matchQuery
        },
        {
            $group: {
                "_id": "$metrics.cutoffdate_qc",
                "data": { "$push": "$$ROOT" }
            }
        },
        {
            $sort: { "_id": 1 }
        },
        // {
        //     $sort: { 'metrics.cutoffdate_qc': -1 }
        // },
        {
            $limit: limit
        }
    ];



}


const mapPipelineRunDSQuery = ({ data, limit }) => {
    const matchData =  cleanEntityData({
        pipelineId: _get(data, 'pipelineId'),
        status: _get(CONSTANTS, 'status.success')
    });

    // return [
    //     {
    //         $match: matchData
    //     },
    //     {
    //         $sort: { "runStart": -1 }
    //     },
    //     {
    //         $limit: limit
    //     }
    // ]
    return [
        { $match: matchData},
        {  $project: {
            doc: '$$ROOT',
            year: {'$year': '$runStart'},
            month: { '$month': '$runStart'}
        }},
        {
            $group: {
                _id: {
                    year: '$year',
                    month: '$month'
                },
                docs: { "$push": "$$ROOT" }
            }
        },
        {
            $sort: { '_id.year': -1, '_id.month': -1}
        },
        {
            $limit: limit
        }
    ]
};

const mapPipelineRunBUQuery = ({ data, limit }) => {
    // const current = moment.utc().endOf('month').toISOString();
    // const previous = moment.utc().subtract(5, 'months').startOf('month').toISOString();
    const matchData =  cleanEntityData({
        pipelineId: _get(data, 'pipelineId'),
        status: _get(CONSTANTS, 'status.success'),
        // runStart: {
        //     '$gte': new Date(previous),
        //     '$lte': new Date(current)
        // }
    });

    // return [
    //     {
    //         $match: matchData
    //     },
    //     {
    //         $sort: { "runStart": -1 }
    //     },
    //     {
    //         $limit: limit
    //     }
    // ]

    return [
        { $match: matchData},
        {  $project: {
            doc: '$$ROOT',
            year: {'$year': '$runStart'},
            month: { '$month': '$runStart'}
        }},
        {
            $group: {
                _id: {
                    year: '$year',
                    month: '$month'
                },
                docs: { "$push": "$$ROOT" }
            }
        },
        {
            $sort: { '_id.year': -1, '_id.month': -1}
        },
        {
            $limit: limit
        }
    ]
};


const DEPipelineRunsAggregateQuery = ({ year, month, pipelineId }) => {
    const matchQuery = {
        pipelineId,
    };
    return [
        {
            $match: matchQuery
        },
        {
            $project: {
                doc: '$$ROOT',
                year: {'$year': '$runStart'},
                month: { '$month': '$runStart'}
            }
        },
        {
            $match: {
                month: month,
                year: year
            }
        },
        {
            $sort: { "doc.runStart": -1 }
        }

    ]
};


const prophetPipelineRunChildQuery = ({ pipelineName, limit }) => {
    const matchData =  cleanEntityData({
        pipelineName,
        status: _get(CONSTANTS, 'status.success')
    });

    return [
        { $match: matchData},
        {  $project: {
            doc: '$$ROOT',
            year: {'$year': '$runStart'},
            month: { '$month': '$runStart'}
        }},
        {
            $group: {
                _id: {
                    year: '$year',
                    month: '$month'
                },
                docs: { "$push": "$$ROOT" }
            }
        },
        {
            $sort: { '_id.year': -1, '_id.month': -1}
        },
        {
            $limit: limit
        }
    ]
}


module.exports = {
    pipelineRunDropdownQuery,
    pipelineRunQuery,
    pipelineRunSearchQuery,
    mapProphetMiscAggregateQuery,
    mapPipelineRunDSQuery,
    mapPipelineRunBUQuery,
    DEPipelineRunsAggregateQuery,
    prophetPipelineRunChildQuery
};