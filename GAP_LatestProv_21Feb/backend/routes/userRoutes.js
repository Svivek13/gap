const UserHandler = require('../handlers/userHandler');
const baseCtrl = require('../private/base-controller');
const { get: _get, isEmpty: _isEmpty } = require('lodash');

module.exports = function(app) {
    app.post('/api/user/login', async(req, res, next) => {
        const body = req.body;
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await UserHandler.userAuthHandler({ body });
            return responseData;
        })
    });

    app.post('/api/user/signup', async(req, res, next) => {
        const body = req.body;
        const origin = _isEmpty(_get(req, 'headers.origin', '')) ? _get(req, 'headers.referer') : `${_get(req, 'headers.origin')}/`
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await UserHandler.useSignupHandler({ body, protocol: req.protocol, origin, url: req.url || req.originalUrl });
            return responseData;
        })
    });

    app.post('/api/user/verify', async(req, res, next) => {
        const body = req.body;
        const origin = _isEmpty(_get(req, 'headers.origin', '')) ? _get(req, 'headers.referer') : `${_get(req, 'headers.origin')}/`
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await UserHandler.userVerificationHandler({ data: body, origin });
            return responseData;
        })
    });

    app.post('/api/user/resend/email', async(req, res, next) => {
        const body = req.body;
        const origin = _isEmpty(_get(req, 'headers.origin', '')) ? _get(req, 'headers.referer') : `${_get(req, 'headers.origin')}/`
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await UserHandler.resendEmailLinkHandler({ data: body, protocol: req.protocol, origin, url: req.url || req.originalUrl });
            return responseData;
        })
    });
    app.post('/api/user/reset/password/request', async(req, res, next) => {
        const body = req.body;
        
        const origin = _isEmpty(_get(req, 'headers.origin', '')) ? _get(req, 'headers.referer') : `${_get(req, 'headers.origin')}/`
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await UserHandler.resetPasswordRequestHandler({ body, protocol: req.protocol, origin, url: req.url || req.originalUrl });
            return responseData;
        })
    });

    app.post('/api/user/reset/password', async(req, res, next) => {
        const body = req.body;
        const origin = _isEmpty(_get(req, 'headers.origin', '')) ? _get(req, 'headers.referer') : `${_get(req, 'headers.origin')}/`
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await UserHandler.resetPasswordHandler({ body, origin, url: req.url || req.originalUrl });
            return responseData;
        })
    });

    app.post('/api/user/invite', async(req, res, next) => {
        const body = req.body;
        const userId = _get(req, 'payload.userId');
        const origin = _isEmpty(_get(req, 'headers.origin', '')) ? _get(req, 'headers.referer') : `${_get(req, 'headers.origin')}/`
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await UserHandler.userInviteHandler({ body, userId, origin });
            return responseData;
        })
    });
    
}
