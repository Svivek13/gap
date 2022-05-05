
const { baseHandler } = require('../private/base-handler');
const { pipelineRunsFind, pipelineRunAggregate } = require('../models/pipelineRun');
const { mapPipelineRunsSearchResponse } = require('../mappers/pipelineRuns');
const { pipelineRunDropdownQuery, pipelineRunSearchQuery } = require('../queryBuilder/pipelineRun');

const pipelineRunSearchHelper = async() => {
    const dropdownQuery = pipelineRunDropdownQuery();
    const query = pipelineRunSearchQuery();
    const [pipelineRuns, dropdowns] = await Promise.all([
        pipelineRunAggregate({ query }),
        pipelineRunAggregate({ query: dropdownQuery })
    ]);
    const response = mapPipelineRunsSearchResponse({ data: pipelineRuns, dropdowns });
    return { content: response};
}

const pipelineRunSearchHandler = async options => baseHandler(pipelineRunSearchHelper, options);

module.exports = {
    pipelineRunSearchHandler
}