const PipelineHandler = require('../handlers/pipelineHandler');
const baseCtrl = require('../private/base-controller');
const { get: _get } = require('lodash');

module.exports = function(app) {
    app.post('/api/pipeline/runs/flowchart', async(req, res, next) => {
        let body = req.body;
        const userId = _get(req.payload, 'userId');
        body = {
            ...body,
            userId
        };
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await PipelineHandler.pipelineFlowchartHandler({ body });
            return responseData;
        })
    });
    app.post('/api/pipeline/child', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await PipelineHandler.pipelineChildFlowchartHandler({ body });
            return responseData;
        });
    });
}
