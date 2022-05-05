const mongoose = require('mongoose');
const { CONSTANTS } = require('../helpers/constant');
const { get: _get } = require('lodash');

const mapXaiDataReqQuery = ({ model, brand, card_type }) => {
    const matchFilter = {
        model: model,
        brand: brand,
        card_type : card_type
    };
    return [
        {
            $match: matchFilter
        },
        // {
        //     $sort: { week_id: -1 }
        // },
        // {
        //     $limit: 1
        // }
    ];
};
module.exports = {
    mapXaiDataReqQuery
}