const dqmCompletenessHandlercl = require('../handlers/dqmCompletenessHandler');
const timelinessHandlercl = require('../handlers/timelinessHandler');
const baseCtrl = require('../private/base-controller');
const { get: _get } = require("lodash");

module.exports = function(app) {
    app.post('/api/DQM-completeness', async(req, res, next) => {
        const body = req.body;
       baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await dqmCompletenessHandlercl.dqmCompletenessHandler({ body });
            return responseData;
        })
    });

    app.post('/api/DQM-timeliness', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await timelinessHandlercl.timelinessHandler({ body });
            return responseData;
        })
    });
  
    
}
