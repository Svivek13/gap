const dqmUniquenessHandlercl = require('../handlers/dqmUniquenessHandler');
const baseCtrl = require('../private/base-controller');
const { get: _get } = require("lodash");

module.exports = function(app) {
    app.post('/api/DQM-Uniqueness', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await dqmUniquenessHandlercl.dqmUniquenessHandler({ body });
            return responseData;
        })
    });
  
    
}
