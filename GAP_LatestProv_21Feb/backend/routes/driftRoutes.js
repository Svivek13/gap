const DriftHandler = require('../handlers/driftHandler');
const baseCtrl = require('../private/base-controller');

module.exports = function(app) {
    app.post('/api/drift', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await DriftHandler.driftReqHandler({ body });
            return responseData;
        })
    });

    app.post('/api/drift/train/test', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await DriftHandler.driftTestVsTrainHandler({ body });
            return responseData;
        })
    });

    
}
