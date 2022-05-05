const EventEmitter = require('events');
const _ = require('lodash');
const {  logInfo, logError } = require('aob-logger-wrapper');
const MESSAGE_CODES = require('./log-message-codes');

const httpClientRequestLogger = new EventEmitter();

httpClientRequestLogger.on('request', (request) => {
    // console.log('request', request);
    logInfo({
        code: MESSAGE_CODES.outgoingRequestCode,
        message: 'Make request to external service',
        req: request,
        correlationId: _.get(request, 'headers.correlationid'),
    });
});

httpClientRequestLogger.on('success', (request, response) => {
    // console.log('request', request);
    // console.log('response', response);
    logInfo({
        code: MESSAGE_CODES.outgoingResponseCode,
        message: 'Successful response from other service',
        req: request,
        res: response,
        correlationId: _.get(request, 'headers.correlationid'),
    });
});

httpClientRequestLogger.on('error', (error, response, request) => {
    // console.log('error', error);
    // console.log('request', request);
    // console.log('response', response);
    logError({
        code: MESSAGE_CODES.outgoingErrorCode,
        message: 'Error from other service',
        error,
        res: response,
        correlationId: _.get(request, 'headers.correlationid'),
    });
});

module.exports = { httpClientRequestLogger };
