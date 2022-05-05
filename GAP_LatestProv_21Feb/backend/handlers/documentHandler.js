const { metaDataFindOne, metaDataFind } = require("../models/metaData");
const { baseHandler } = require("../private/base-handler");
const { downloadAndStreamFileFromAzure } = require("../private/download-from-azure");
const { mapMetadataDocQuery } = require("../queryBuilder/metaData");
const { get: _get, isEmpty: _isEmpty } = require('lodash');
const { faqFind } = require("../models/faq");
const errorMessage = require("../private/error-message-codes");
const CustomError = require('../private/custom-error');
const { sendErrorResponse } = require('../private/base-controller');

const getMetaDatafileHelper = async ({res, body, next}) => {
    // const filePath = 'meta-data-files/endUserLicenseAgreement.pdf';
    // console.log(body, 'inside handler');
    const metaDataDocQuery = mapMetadataDocQuery({ data: body });

    const metaData = await metaDataFindOne(metaDataDocQuery);
    if (_isEmpty(metaData)) {
        // res.header('Content-Type', 'application/json');
        
        const err = new CustomError(404, _get(errorMessage, 'notFound'));
        // console.log(err);
        // res.status(404).json({
        //     statusCode
        // });
        // return
        sendErrorResponse(err, {}, next, res );
        return;
    }
    const filePath = _get(metaData, 'properties.filePath');
    // console.log('filePath', filePath, metaData, metaDataDocQuery);
    downloadAndStreamFileFromAzure({ filePath, res });
}
const getMetaDatafileHandler = async (options) =>  baseHandler(getMetaDatafileHelper, options);


module.exports = {
    getMetaDatafileHandler,
}