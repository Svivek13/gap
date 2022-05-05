const { logError } = require('aob-logger-wrapper');
const MESSAGE_CODES = require('../private/log-message-codes');

async function baseHandler(wrapperFunc, options) {
    let data;
    try {
        data = await wrapperFunc(options);
    } catch (err) {
        // console.log(err, '===================error in basehandler =====================');
        logError({
            code: MESSAGE_CODES.appResponseErrorCode,
            message: 'Error in handler',
            error: err,
        });
        throw err;
    }
    return data;
}

module.exports = {
    baseHandler
};

// module.exports = baseHandler;
