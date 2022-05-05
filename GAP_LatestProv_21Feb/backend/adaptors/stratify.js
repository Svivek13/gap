const { get: _get } = require('lodash');
const { post: httpClientPost } = require('../private/http-client');

const { env }  = require("../config/env");

const { makeUrl, cleanEntityData } = require("../helpers/commonUtils");

// const { makeUrl } = require('../helper/commonUtil');

const baseUrl = _get(env, 'baseUrl.pythonService');


const stratifyAdaptor = async ({ body }) => {
    
    
    const relativeUrl = 'stratify';
    const url = makeUrl(baseUrl, [`${relativeUrl}`]);
    
    
    const headers = [{
        name: 'Content-Type',
        value: 'application/json',  
    }];

    // const headers = [];

   
   
    const response = await httpClientPost(url, body, headers);
    return response;


};






module.exports = {
    stratifyAdaptor,
}