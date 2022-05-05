const XaiHandlerGap = require('../handlers/xaiHandlerGap');
const baseCtrl = require('../private/base-controller');

module.exports = function(app) {
    app.post('/api/xai/global-chart-gap', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await XaiHandlerGap.xaiReqHandler({ body });
            return responseData;
        })
    });
    app.post('/api/xai/brandDropdown', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await XaiHandlerGap.xaiDropdownBrandHandler({ body });
            return responseData;
        })
    });
    app.post('/api/xai/locationDropdown', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await XaiHandlerGap.xaiDropdownLocationHandler({ body });
            return responseData;
        })
    });
}
