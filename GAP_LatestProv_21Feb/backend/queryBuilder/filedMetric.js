const { cleanEntityData } = require("../helpers/commonUtils");
const { get: _get, isEmpty: _isEmpty } = require('lodash');

const { CONSTANTS } = require('../helpers/constant');
const pipelineRun = require("../models/pipelineRun");

const filedMetric_MAPE_RMSEAggregateQuery = ({ matchQuery }) => {
    return [
        // {
        //     "$match": { country: 7050, datetime: { $gte: new Date("2020-10-01T00:00:00Z"), $lte: new Date("2020-12-01T00:00:00Z")}}
        // },
        {
            "$match": matchQuery
        },
        {
            "$project": {
                "datetime": 1,
                "country": 1,
                "dist": 1,
                "sku": 1,
                "MAPE": 1,
                "RMSE": 1,
                "RMSE_perc": 1,
                "Regressors_list": 1,
                "Regressors_list1": 1,
                "growth": 1,
                "seasonality_mode": 1,
                "Method": 1,
                "Regressors_flag": 1,
                "health_score": 1
            }
            
        },
        // {
        //     "$sort": { "RMSE_perc": 1 }
        // },
        // {
        //     "$group": {
        //         "_id": "$datetime",
        //         "data": { "$push": "$$ROOT" }
                
                
        //     }
        // },
        // {
        //     "$sort": { "_id": 1 }
        // }
        {
            "$sort": {"datetime": -1}
        }
    ]
};


// const mapBusinessUserQuery = ({ data }) => cleanEntityData({
//     file_name: _get(CONSTANTS, 'fileName.qc'),
//     country: _get(data, 'country'),
//     CALENDER_YEAR_ac: _get(data, 'year'),
//     CALENDER_MONTH_NUMBER_ac: _get(data, 'month')
// });

const mapBusinessUserAggregatedQuery = ({ data, childPiplineRuns, selectionQuery }) => {
    const matchQuery = cleanEntityData({
        file_name: _get(CONSTANTS, 'fileName.qc'),
        country: _get(data, 'country') || _get(selectionQuery, 'country'),
        pipelineRunId: !_isEmpty(childPiplineRuns) ? { "$in": childPiplineRuns } : undefined,
    });

    return [
        {
            $match: matchQuery
        },
        {
            "$group": {
               "_id": "$datetime",
               "data": { "$push": "$$ROOT" }
            }
        },
        {
            "$sort": { "_id": -1}
        }
    ]
};

const mapBUHealthScoreQuery = ({ selectionQuery, pipelineRuns }) => {
    const matchQuery = cleanEntityData({
        'metrics.country': _get(selectionQuery, 'country'),
        runId: { $in: pipelineRuns },
        pipelineName: _get(CONSTANTS, 'BUHealthScore.pipelineName')
    });
    return [
        {
            $match: matchQuery
        },
        {
            "$group": {
                "_id": "$metrics.cutoffdate",
                "data": { "$push": "$$ROOT" }
             }
        },
        {
            $sort: {_id: -1}
        }
    ]
}

module.exports = {
    filedMetric_MAPE_RMSEAggregateQuery,
    // mapBusinessUserQuery,
    mapBusinessUserAggregatedQuery,
    mapBUHealthScoreQuery,
}