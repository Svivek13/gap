const StratifyHandler = require('../handlers/stratifyHandler');
const baseCtrl = require('../private/base-controller');
const { get: _get } = require("lodash");

module.exports = function(app) {
    app.post('/api/stratify', async(req, res, next) => {
        
        
        const body = req.body;
        // const customHeaders = req.customHeaders;
        // console.log(req.customHeaders);
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await StratifyHandler.stratifyHandler({ body });
            return responseData;
        })
    });
}
