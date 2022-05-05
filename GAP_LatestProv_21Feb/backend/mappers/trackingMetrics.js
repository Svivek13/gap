const { cleanEntityData } = require("../helpers/commonUtils");
const { get: _get, map: _map, has: _has, isEmpty: _isEmpty } = require('lodash');

const mapTMData = ({ data }) => cleanEntityData({
    sessionId: _get(data, 'sessionId'),
    username: _get(data, 'username'),
    userId: _get(data, 'userId'),
    userMail: _get(data, 'userMail'),
    screenName: _get(data, 'screenName'),
    eventType: _get(data, 'eventType'),
    descriptionId: _get(data, 'descriptionId'),
    value: _get(data, 'value'),
    timestamp: _get(data, 'timestamp'),
})

const mapTMDescData = ({ data }) => cleanEntityData({
    descId: _get(data, 'descId'),
    descContent: _get(data, 'descContent'),
})

module.exports = {
    mapTMData,
    mapTMDescData
}