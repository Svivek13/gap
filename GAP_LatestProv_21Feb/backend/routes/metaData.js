const MetaDataHandler = require('../handlers/metadataHandler');
const baseCtrl = require('../private/base-controller');
const { get: _get } = require("lodash");

module.exports = function(app) {
    app.post('/api/meta/data', async(req, res, next) => {
        
        const body = req.body;
        // console.log(body, 'body');
        // MetaDataHandler.getMetaDatafileHandler({ res, body, next });

        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await MetaDataHandler.getMetaDataHandler({ res, body });
            return responseData;
        });
    });
}
