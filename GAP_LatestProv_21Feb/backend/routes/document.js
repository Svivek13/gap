const DocumentHandler = require('../handlers/documentHandler');
const baseCtrl = require('../private/base-controller');
const { get: _get } = require("lodash");

module.exports = function(app) {
    app.post('/api/doc/meta/file', async(req, res, next) => {
        
        const body = req.body;
        // console.log(body, 'body');
        DocumentHandler.getMetaDatafileHandler({ res, body, next });

        // baseCtrl.postAsync(req, res, next, async (_) => {
        //     const responseData = await DocumentHandler.getMetaDatafileHandler({ res, body });
        //     return responseData;
        // });
    });
}
