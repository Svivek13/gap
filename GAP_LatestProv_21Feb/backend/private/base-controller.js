const { get:_get } = require('lodash');
const { logError, logInfo } = require('aob-logger-wrapper');
const HttpStatus = require('http-status-codes');
const MESSAGE_CODES = require('./log-message-codes');
const expressInterceptor = require('express-interceptor');
/* eslint-disable no-unreachable */
const sendErrorResponse = (err, logger, next, res) => {
  const statusCode = _get(err, 'error.statusCode') || _get(err, 'statusCode') || (() => {
    const errCode = _get(err, 'error.code', '');
    return errCode.match(/(ETIMEDOUT|ENETUNREACH)/ig) ? 504 : false;
  })() || 500;
  const message = _get(err, 'error.message') || _get(err, 'message') || 'Server Error';
  logError({
    code: MESSAGE_CODES.appResponseErrorCode,
    message: 'Response Error',
    error: err,
    req: res.req,
    res,
  });
  res.status(statusCode).send({ message, code: statusCode }); // Cannot set headers after they are sent to the client - error coming for auto-configure api (have also seen for some other api)
  return next(false);
};



const getResource = (logger, res, next, func) => {
  const result = { content: undefined, statusCode: 200, message: undefined };
  try {
    func(result).then(() => {
      if (result.statusCode === 200) {
        res.send(result.content);
        return next(false);
      }

      res.send(result.statusCode, { message: result.message });
      return next(false);
    }).catch(err => sendErrorResponse(err, logger, next, res));
  } catch (err) {
    sendErrorResponse(err, logger, next, res);
  }
};

const updateResource = (logger, res, next, func) => {
  const result = { content: undefined, statusCode: 204, message: undefined };
  try {
    func(result).then(() => {
      if (result.statusCode === 204) {
        if (!result.content) {
          res.sendStatus(204);
          return next(false);
        }
        res.send(result.content);
        return next(false);
      }
      res.send(result.statusCode, { message: result.message });
      return next(false);
    }).catch(err => sendErrorResponse(err, logger, next, res));
  } catch (err) {
    sendErrorResponse(err, logger, next, res);
  }
};


const postResource = (logger, res, next, func) => {
  const result = { content: undefined, statusCode: 201, message: undefined };
  try {
    func(result).then(() => {
      if (result.statusCode === 201) {
        if (!result.content) {
          res.sendStatus(201);
          return next(false);
        }
        res.send(result.content);
        return next(false);
      }
      res.send(result.statusCode, { message: result.message });
      return next(false);
    }).catch(err => sendErrorResponse(err, logger, next, res));
  } catch (err) {
    sendErrorResponse(err, logger, next, res);
  }
};

const deleteResource = (logger, res, next, func) => {
  const result = { content: undefined, statusCode: 204, message: undefined };
  try {
    func(result).then(() => {
      if (result.statusCode === 204) {
        if (!result.content) {
          res.sendStatus(204);
          return next(false);
        }
        res.send(result.content);
        return next(false);
      }
      res.send(result.statusCode, { message: result.message });
      return next(false);
    }).catch((err) => {
      res.send(500, { message: 'Server Error' });
      return next(false);
    });
  } catch (err) {
    res.send(500, { message: 'Server Error.' });
    return next(false);
  }
};

async function postResourceAsync(req, res, next, func) {
  let bgFunc;
  // req-res specific try catch
  try {
    const data = await func();
    const content = _get(data, 'content');
    const message = _get(data, 'message');
    bgFunc = _get(data, 'bgFunc', false);
    if (!content) {
      res.status(HttpStatus.CREATED).send({ message: message || HttpStatus.getStatusText(HttpStatus.CREATED) });
    } else {
      res.status(HttpStatus.CREATED).send({ data: content, message });
    }
  } catch (e) {
    return sendErrorResponse(e, {}, next, res);
  }

  try {
    bgFunc && bgFunc();
  } catch (e) {
    console.log(e);
    logError({
      code: MESSAGE_CODES.backGroundFuncFailureCode,
      message: 'Backgrond Func Error',
      error: e,
    });
  }
  return next(false);
}

async function getResourceAsync(req, res, next, func) {
    let bgFunc;
    // req-res specific try catch
    try {
      const data = await func();
      const content = _get(data, 'content');
      const message = _get(data, 'message');
      bgFunc = _get(data, 'bgFunc', false);
      if (!content) {
        res.status(HttpStatus.OK).send({ data });
      } else {
        res.status(HttpStatus.OK).send({ data: content, message });
      }
    } catch (e) {
      return sendErrorResponse(e, {}, next, res);
    }
  
    try {
      bgFunc && bgFunc();
    } catch (e) {
      logError({
        code: MESSAGE_CODES.backGroundFuncFailureCode,
        message: 'Backgrond Func Error',
        error: e,
      });
    }
    return next(false);
  }

module.exports = {
 get: getResource,
 update: updateResource,
 post: postResource,
 postAsync: postResourceAsync,
 getAsync: getResourceAsync,
 sendErrorResponse,
};
