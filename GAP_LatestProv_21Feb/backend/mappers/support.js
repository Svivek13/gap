const { cleanEntityData } = require("../helpers/commonUtils");
const { get: _get } = require('lodash');

const mapSupportReq = ({ data, userId }) => cleanEntityData({
    subject: _get(data, 'subject'),
    query: _get(data, 'query'),
    createdBy: userId,
});

module.exports = {
    mapSupportReq,
}