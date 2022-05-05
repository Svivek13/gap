const EmailHandler = require('../handlers/emailHandler');
const baseCtrl = require('../private/base-controller');

module.exports = function(app) {
    app.post('/api/email/send', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await EmailHandler.emailSendHandler({ body });
            return responseData;
        })
    });

    
}
