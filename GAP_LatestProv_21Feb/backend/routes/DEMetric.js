const DEMetricHandler = require('../handlers/dataEngineerHandler');
const DESyndMetricHandler = require('../handlers/dataEngineerSyndicationHandler');
const dataDriftGapHandler_ = require('../handlers/dataDrift_GapHandler');
const DEMetricsDrillDown = require('../handlers/DEMatricsDrillDownHandler')
const baseCtrl = require('../private/base-controller');
const { get: _get } = require("lodash");

module.exports = function(app) {
    app.post('/api/de-metric', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await DEMetricHandler.dataEngineerHandler({ body });
            return responseData;
        })
    });
    app.post('/api/de-syndication', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await DESyndMetricHandler.dataEngineerSyndHandler({ body });
            return responseData;
        })
    });
    app.post('/api/de-drillDown', async(req, res, next) => {
        const body = req.body;
         baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await DEMetricsDrillDown.DEMetricsDrillDownHandler({ body });
            return responseData;
        })
    });
    app.post('/api/de-dropdown-attribute', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await DESyndMetricHandler.dataEngineerSyndAttrHandler({ body });
            return responseData;
        })
    });
    app.post('/api/de-dropdown-location', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await DESyndMetricHandler.dataEngineerSyndLocationHandler({ body });
            return responseData;
        })
    });

    app.post('/api/de-dropdown-brand', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await DESyndMetricHandler.dataEngineerSyndBrandHandler({ body });
            return responseData;
        })
    });
   
}
