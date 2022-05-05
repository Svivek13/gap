const FAQHandler = require('../handlers/faqHandler');
const baseCtrl = require('../private/base-controller');
const { get: _get } = require("lodash");

module.exports = function(app) {
    app.get('/api/faq', async(req, res, next) => {
        
        

        baseCtrl.getAsync(req, res, next, async (_) => {
            const responseData = await FAQHandler.fetchFAQHandler();
            return responseData;
        })
    });
}
