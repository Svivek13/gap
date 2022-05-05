const PipelineRunHandler = require('../handlers/pipelineRunHandler');
const baseCtrl = require('../private/base-controller');

module.exports = function(app) {
    app.post('/api/pipeline/runs/search', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await PipelineRunHandler.pipelineRunSearchHandler({ body });
            return responseData;
        })
    });
}
