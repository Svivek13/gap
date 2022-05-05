const { cleanEntityData } = require("../helpers/commonUtils")
const { get: _get } = require('lodash');

const mapMetadataDocQuery = ({ data }) => {
    return cleanEntityData({
        type: 'doc',
        'properties.name': _get(data, 'name'),
    });
};


const mapMetadataQuery = ({ data }) => {
    return cleanEntityData({
        type: _get(data, 'type'),
        'properties.name': _get(data, 'name'),
    });
};


module.exports = {
    mapMetadataDocQuery,
    mapMetadataQuery
}