
const { cleanEntityData } = require('../helpers/commonUtils');

const { baseHandler } = require('../private/base-handler');
const { createSupportTicket } = require("../models/supportTicket");
const { mapSupportReq } = require('../mappers/support');
const { emailSendHandler } = require('../handlers/emailHandler');
const { get: _get } = require('lodash');
const { supportRes } = require('../mappers/outbound/support');





const generateSupportTicketHelper = async ({ body, userId }) => {
    
    const supportData = mapSupportReq({ data: body, userId });
    const createRes = await createSupportTicket(supportData);
    const response = supportRes({ data: createRes });
    return { content: response};
}


const generateSupportTicketHandler = async options => baseHandler(generateSupportTicketHelper, options);

module.exports = {
    generateSupportTicketHandler,
    
}
