const cockpitHandler1 = require('../handlers/cockpitHandlers');
const baseCtrl = require('../private/base-controller');
const { get: _get } = require("lodash");

module.exports = function(app) {
    app.post('/api/cockpitData', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await cockpitHandler1.cockpitHandler({ body });
            return responseData;
        })
    });
    app.post('/api/dropDownModel', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await cockpitHandler1.cockpitHandlerDropDown({ body });
            return responseData;
        })
    });
  
    
}
