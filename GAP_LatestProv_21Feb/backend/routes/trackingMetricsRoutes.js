const TMHandler = require('../handlers/trackingMetricsHandler');
const baseCtrl = require('../private/base-controller');

module.exports = function(app) {
    app.post('/api/tracking-metrics', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await TMHandler.eventTrackingHandler({ body });
            return responseData;
        })
    });

    app.post('/api/tracking-metrics/desc', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await TMHandler.descHandler({ body });
            return responseData;
        })
    });

    app.post('/api/tracking-metrics/events', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await TMHandler.tmEventsHandler({ body });
            return responseData;
        })
    });
}