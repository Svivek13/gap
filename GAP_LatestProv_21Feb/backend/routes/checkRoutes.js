const _ = require('lodash');
const CheckHandler = require('../handlers/checkHandler');
const baseCtrl = require('../private/base-controller');


module.exports = function(app) {
    app.post('/api/check', (req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await CheckHandler.checkHandler({ body });
            return responseData;
        })
    });
}
