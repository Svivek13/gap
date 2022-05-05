const XaiHandler = require('../handlers/xaiHandler');
const baseCtrl = require('../private/base-controller');

module.exports = function(app) {
    app.post('/api/xai/global-chart', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await XaiHandler.xaiReqHandler({ body });
            return responseData;
        })
    });

    app.post('/api/xai/scatter-plot', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await XaiHandler.xaiScatterPlotReqHandler({ body });
            return responseData;
        })
    });
}
