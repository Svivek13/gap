const SupportHandler = require('../handlers/supportHandler');
const baseCtrl = require('../private/base-controller');
const { get: _get } = require("lodash");

module.exports = function(app) {
    app.post('/api/support/ticket', async(req, res, next) => {
        
        
        const body = req.body;
        const userId = _get(req, 'payload.userId');
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await SupportHandler.generateSupportTicketHandler({ body, userId });
            return responseData;
        })
    });
}
