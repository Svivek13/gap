const { get: _get } = require('lodash');
const { cleanEntityData } = require('../../helpers/commonUtils');

const supportRes = ({ data }) => cleanEntityData({
    code: 1,
    id: _get(data, '_id'),
    message: "Ticket is successfully generated"
});


module.exports = {
    supportRes,
}