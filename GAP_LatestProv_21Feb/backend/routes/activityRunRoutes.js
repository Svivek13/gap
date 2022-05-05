const ActivityRunHandler = require('../handlers/activityRunHandler');
const baseCtrl = require('../private/base-controller');

module.exports = function(app) {
    app.post('/api/pipeline/activity', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await ActivityRunHandler.activityRunSearchHandler({ body });
            return responseData;
        })
    });
}
