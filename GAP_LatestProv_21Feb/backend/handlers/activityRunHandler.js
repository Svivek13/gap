
const { baseHandler } = require('../private/base-handler');
const { activityRunsFind } = require('../models/activityRun');
const { pipelineRunsFindOne } = require('../models/pipelineRun');
const { pipelineFindOne } = require('../models/pipeline');
const { getActivityQuery } = require('../queryBuilder/activityRun');
const { mapActivityRunsSearchResponse, findActivityLastGroupedObj } = require('../mappers/activityRuns');
const { get: _get, isEmpty: _isEmpty, groupBy: _groupBy, orderBy: _orderBy } = require('lodash');


const activityRunSearchHelper = async({ body }) => {
    // const query = getActivityQuery({ data: body });
    // const activityRuns = await activityRunsFind({ getFields: query });
    // const response = mapActivityRunsSearchResponse({ data: activityRuns });
    // return { content: response};

    const pipelineRun = await pipelineRunsFindOne({
        _id: _get(body, 'runId')
    });

    if (_isEmpty(pipelineRun)) {
        return { content: {}};
    };
    const pipeline = await pipelineFindOne({
        _id: _get(pipelineRun, 'pipelineId')
    });
    // console.log(pipeline);
    const activity = await activityRunsFind({ getFields: { pipelineRunId: _get(body, 'runId')}});
    const groupedActivity = _groupBy(activity, 'activityName');
    const enrichedActivity = findActivityLastGroupedObj({ data: groupedActivity });
    const response = mapActivityRunsSearchResponse({ activity: enrichedActivity, pipeline });
    const orderedResponse = _orderBy(response, ['activityRunStart'], ['asc']);
    return { content: orderedResponse };
}

const activityRunSearchHandler = async options => baseHandler(activityRunSearchHelper, options);

module.exports = {
    activityRunSearchHandler
}