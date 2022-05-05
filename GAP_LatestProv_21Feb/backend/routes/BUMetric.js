const BUMetricHandler = require('../handlers/businessUserHandler');
const baseCtrl = require('../private/base-controller');
const { get: _get } = require("lodash");

module.exports = function(app) {
    app.post('/api/bu-metric', async(req, res, next) => {
        const body = req.body;

        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await BUMetricHandler.businessUserHandler({ body });
            return responseData;
        })
    });

    // app.post('/api/bu-metric/bank', async(req, res, next) => {
    //     const body = req.body;
        

    //     baseCtrl.postAsync(req, res, next, async (_) => {
    //         const responseData = await BUMetricHandler.businessUserHandler({ body });
    //         return responseData;
    //     })
    // });
}
