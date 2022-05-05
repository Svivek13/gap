const _ = require('lodash');
const DashboardHandler = require('../handlers/dashboardHandler');
const baseCtrl = require('../private/base-controller');

module.exports = function(app) {
    app.post('/api/dashboard', (req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await DashboardHandler.dashboardHandler({ body });
            return responseData;
        })
    });

    app.post('/api/dashboard/filter', (req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await DashboardHandler.dashboardFilterHandler({ body });
            return responseData;
        })
    });

    app.get('/api/dashboard/datascience/dropdown', (req, res, next) => {
        baseCtrl.getAsync(req, res, next, async () => {
            const responseData = await DashboardHandler.dataSceinceDropdownHandler();
            return responseData;
        })
    })

    app.get('/api/dashboard/businessuser/dropdown', (req, res, next) => {
        baseCtrl.getAsync(req, res, next, async () => {
            const responseData = await DashboardHandler.businessUserDropdownHandler();
            return responseData;
        })
    });

    app.post('/api/dashboard/prophet', (req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await DashboardHandler.dashboardProphetHandler({ body });
            return responseData;
        })
    });

    app.get('/api/dashboard/dropdown/dist', (req, res, next) => {
        const country = req.query.country;
        baseCtrl.getAsync(req, res, next, async () => {
            const responseData = await DashboardHandler.distributionDropdownHandler({ country });
            return responseData;
        })
    });

    app.get('/api/dashboard/dropdown/sku', (req, res, next) => {
        const dist = req.query.dist;
        baseCtrl.getAsync(req, res, next, async () => {
            const responseData = await DashboardHandler.skuDropdownHandler({ dist });
            return responseData;
        })
    });
    app.post('/api/dashboard/drift/feature', (req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await DashboardHandler.dashboardDriftFeatureHandler({ body });
            return responseData;
        })
    });
    app.get('/api/dashboard/dropdown/yearmonth', (req, res, next) => {
        
        baseCtrl.getAsync(req, res, next, async (_) => {
            const responseData = await DashboardHandler.yearMonthDropdownHandler();
            return responseData;
        })
    });
}
