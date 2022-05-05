const { cleanEntityData } = require("../helpers/commonUtils");
const { get: _get } = require("lodash");

const adminMetaDataProjectQuery = ({ data }) => cleanEntityData({
    _id: _get(data, 'projectId')
});


module.exports = {
    adminMetaDataProjectQuery,
}