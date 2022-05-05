const _ = require('lodash');
const { baseHandler } = require('../private/base-handler');
const moment = require('moment');
const { filedMetricFind, filedMetricFindOne, filedMetricAggregate } = require('../models/filedMetric');

const checkHelper = async () => {
    const today = moment().endOf('month').format();
    const now = moment();
    const chau = moment().format();
    const hau = moment().toISOString();
    const previous = moment().subtract(6, 'months').startOf('month').toISOString();
    const query = [
        // {
        //     $match: { datetime: { $gte: hau }, country: 7050 }
        // }
        {
            $match: {  datetime: { $gte: new Date('2020-10-01T00:00:00Z'), $lte: new Date('2020-12-01T00:00:00Z') }}
        },
       

    ];
    // const response = await filedMetricFindOne({ datetime: '2020-12-01T00:00:00Z' });
    console.log(JSON.stringify(query));
    // const response = await filedMetricFind({ datetime: '2020-12-01T00:00:00Z' });
    const response = await filedMetricAggregate(query);
    // console.log('response', response);
    return { content: response };
    
    // return { content: { working: today, previous, now, chau, hau }};
}

const checkHandler = async options => baseHandler(checkHelper, options);

module.exports = {
    checkHandler
}