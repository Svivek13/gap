
const request = require('request-promise');
const _ = require('lodash');
const { httpClientRequestLogger: httpClientLogger } = require('./http-client-logger');
// --private functions--

let defaultTimeout;

const setDefaultTimeOut = (timeout) => {
  defaultTimeout = timeout;
};

const addCustomHeaders = (options, customHeaders) => {
  if (customHeaders && Array.isArray(customHeaders) && customHeaders.length && options && options.headers) {
    customHeaders.forEach((item) => {
      options.headers[item.name] = item.value;
    });
  }
};

const createBasicOptions = (url, verb, customHeaders, reqBody, timeoutInMs, needTimeOut = true) => {
  const options = {
    uri: url,
    proxy: false,
    method: verb,
    headers: { startTime: new Date().toJSON().split('Z')[0] },
    json: true,
    resolveWithFullResponse: true,
    time: true,
  };

  if (needTimeOut) {
    options.timeout = timeoutInMs || parseInt(defaultTimeout, 10);
  }

  if (!_.isEmpty(reqBody) && (verb === 'POST' || verb === 'PUT' || verb === 'PATCH')) {
    options.body = reqBody;
  }

  addCustomHeaders(options, customHeaders);
  return options;
};

const parseRequestBodyOrError = (options) => {
  const reqWithOptions = request(options);
  httpClientLogger.emit('request', reqWithOptions);
  return reqWithOptions.then((fullResponse) => {
    httpClientLogger.emit('success', fullResponse.request, fullResponse);
    return Promise.resolve(fullResponse.body);
  }).catch((err) => {
    httpClientLogger.emit('error', err, err.response, reqWithOptions);
    return Promise.reject(err);
  });
};

// public functions
const getResource = (url, customHeaders, contentType = 'application/json', timeoutInMs, needTimeOut) => {
  const options = createBasicOptions(url, 'GET', customHeaders, timeoutInMs, needTimeOut);
  if (!options.headers['content-type']) {
    options.headers['content-type'] = contentType;
  }
  return parseRequestBodyOrError(options);
};

const postResource = (url, reqBody, customHeaders, contentType = 'application/json', timeoutInMs, needTimeOut) => {
  const options = createBasicOptions(url, 'POST', customHeaders, reqBody, timeoutInMs, needTimeOut);
  if (!options.headers['content-type']) {
    options.headers['content-type'] = contentType;
  }

  return parseRequestBodyOrError(options);
};

const putResource = (url, reqBody, customHeaders, timeoutInMs, needTimeOut) => {
  const options = createBasicOptions(url, 'PUT', customHeaders, reqBody, timeoutInMs, needTimeOut);
  if (!options.headers['content-type']) {
    options.headers['content-type'] = 'application/json';
  }
  return parseRequestBodyOrError(options);
};

const deleteResource = (url, customHeaders, timeoutInMs, needTimeOut) => {
  const options = createBasicOptions(url, 'DELETE', customHeaders, timeoutInMs, needTimeOut);
  return parseRequestBodyOrError(options);
};

const patchResource = (url, reqBody, customHeaders, contentType = 'application/json', timeoutInMs, needTimeOut) => {
  const options = createBasicOptions(url, 'PATCH', customHeaders, reqBody, timeoutInMs, needTimeOut);
  if (!options.headers['content-type']) {
    options.headers['content-type'] = contentType;
  }
  return parseRequestBodyOrError(options);
};

const postResourceForFile = (url, reqBody, customHeaders, formData, contentType = 'multipart/form-data', timeoutInMs, needTimeOut) => {
  const options = createBasicOptions(url, 'POST', customHeaders, reqBody, timeoutInMs, needTimeOut);
  if (!options.headers['content-type']) {
    options.headers['content-type'] = contentType;
  }
   options.formData = formData;
  return parseRequestBodyOrError(options);
};

const postResourceForForm = (url, reqBody, customHeaders, form, timeoutInMs, needTimeOut) => {
  const options = createBasicOptions(url, 'POST', customHeaders, reqBody, timeoutInMs, needTimeOut);
  options.form = form;
  return parseRequestBodyOrError(options);
};

module.exports = {
    get: getResource,
    put: putResource,
    post: postResource,
    delete: deleteResource,
    patch: patchResource,
    setDefaultTimeOut,
    postFile: postResourceForFile,
    postForm: postResourceForForm,
}
