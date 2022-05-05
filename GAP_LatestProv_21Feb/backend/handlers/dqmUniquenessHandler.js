const { isEmpty: _isEmpty, get: _get, set: _set, orderBy: _orderBy, min: _min, max: _max, toNumber: _toNumber, reduce: _reduce } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { dqmUniquenessFind_GAP,dqmUniquenessFind_GAPWithOptions } = require('../models/dqmUniquenessModel');

const query = [
    // {
    //     $match: { datetime: { $gte: hau }, country: 7050 }
    // }
    {
        $match:{
            $sort: { uniquenessScore: -1 },
            $limit:1
        }
    },
   

];
const dqmUniquenessHelper = async ({ body }) => {
//   const sortRes = await dqmUniquenessFind_GAPWithOptions( [
//     { $sort : { uniquenessScore: -1 } }
//   ]);
//      console.log("Check",sortRes);
    const response = await dqmUniquenessFind_GAP(body)

    const finalResponse = response;

    return { content: finalResponse };

}
const dqmUniquenessHandler = async options => baseHandler(dqmUniquenessHelper, options);
module.exports = {
    dqmUniquenessHandler
}