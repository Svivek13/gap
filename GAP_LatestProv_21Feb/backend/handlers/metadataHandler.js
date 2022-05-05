const { metaDataFindOne } = require("../models/metaData");
const { baseHandler } = require("../private/base-handler");
const { mapMetadataQuery } = require("../queryBuilder/metaData");
const { isEmpty: _isEmpty, get: _get } = require('lodash');
const CustomError = require('../private/custom-error');
const errorMessage = require("../private/error-message-codes");

const getMetaDataHelper = async ({ body }) => {
    const query = mapMetadataQuery({ data: body })
    const dbRes = await metaDataFindOne(query);
    if (_isEmpty(dbRes)) {
        // res.header('Content-Type', 'application/json');
        
        const err = new CustomError(404, _get(errorMessage, 'notFound'));
        throw err;
    }
    return { content: dbRes };
}

const getMetaDataHandler = async options => baseHandler(getMetaDataHelper, options);


module.exports = {
    getMetaDataHandler,
}