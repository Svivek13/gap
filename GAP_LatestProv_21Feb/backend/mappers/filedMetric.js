const { get: _get, map: _map, isEmpty: _isEmpty, filter: _filter, orderBy: _orderBy, reduce: _reduce, find: _find, get } = require('lodash');
const moment = require('moment');
const { cleanEntityData, enrichArrDataToObj, findMonthDate, findYear, findMonthDateCheck, findMonthNumber, removeDateFromMonth } = require('../helpers/commonUtils');
const { CONSTANTS } = require('../helpers/constant');

const mapfiledMetricMatchQuery = ({ data, selectionQuery, childPiplineRuns }) => {
    const current = moment.utc().endOf('month').toISOString();
    const previous = moment.utc().subtract(5, 'months').startOf('month').toISOString();
    const response = cleanEntityData({
        pipelineRunId: !_isEmpty(childPiplineRuns) ? { "$in": childPiplineRuns } : undefined,
        file_name: _get(CONSTANTS, 'fileName.parameter'),
        country: _get(data, 'country') || _get(selectionQuery, 'country'),
        dist: _get(data, 'dist') || _get(selectionQuery, 'dist'),
        sku: _get(data, 'sku') || _get(selectionQuery, 'sku'),
        // datetime: {
        //     '$gte': new Date(previous),
        //     '$lte': new Date(current)
        // }
    });
    return response;

};

const findMonth = ({ date }) => {
    return moment.parseZone(date).format("MMM");
};

const mapFileMetricLineCharts = ({ filedMetric, latestFiledMetric }) => {
    let labels = [];
    let mapeData = [];
    let rmseData = [];
    // console.log('latest', latestFiledMetric);
    
    const orderFiledMetric = _orderBy(filedMetric, ['datetime'], ['asc']);
    // const filedMetricData = _map(filedMetric, fm => {
    //     // console.log('month', _get(fm, 'data.0'));
    //     const month = findMonth({ date: _get(fm, '_id') });
    //     labels.push(month);
    //     rmseData.push(_get(fm, 'data.0.RMSE'));
    //     mapeData.push(_get(fm, 'data.0.MAPE'));
    //     const tableVariableData = cleanEntityData({
    //         month: month,
    //         ['Promo Variable']: _get(fm, 'data.0.Method') === 0 ? _get(fm, 'data.0.Regressors_list'): _get(fm, 'data.0.Regressors_list1'),
    //         ['Regressor']: _get(fm, 'data.0.Regressors_flag'),
    //         ['Growth']: _get(fm, 'data.0.growth'),
    //         ['Seasonality Mode']: _get(fm, 'data.0.seasonality_mode'),


    //     });
    //     return tableVariableData;

    // });

    // six month start

    const sixMonthPreviousDate = moment.parseZone(_get(latestFiledMetric, 'datetime').toISOString()).subtract(5, 'months').startOf('month');
    const lastestDate = _get(latestFiledMetric, 'datetime');
    // console.log(sixMonthPreviousDate, lastestDate);
    // let startDate = new Date(sixMonthPreviousDate);
    let startDate = sixMonthPreviousDate;
    const endDate = new Date(lastestDate);

    let labels_check = [];
    while (endDate >= startDate) {
        // console.log(startDate, 'startDate');
        const month = findMonth({ date: startDate });
        labels_check.push(month);
        startDate.add(1, 'months');
    };
    // console.log('labels', labels_check);

    // const newFiledMetric = _reduce(filedMetric, (acc, val) => {
    //     const month = findMonthDate({ date: _get(val, 'datetime')})
    //     val['customMonthDate'] = month;
    //     acc.push(val);
    //     return acc;
    // }, []);

    // const enrichedNewFiledMetric = enrichArrDataToObj({ data: newFiledMetric, field: 'customMonth'});
    // const filedMetricData = _map()
    const filedMetricData = _map(orderFiledMetric, fm => {
        // console.log('month', _get(fm, 'data.0'));
        // const month = findMonth({ date: _get(fm, 'datetime') });
        const month = findMonthDate({ date: _get(fm, 'datetime') })
            // console.log('month', month);
        labels.push(month);
        let mapeValue = _get(fm, 'MAPE') ? Number(_get(fm, 'MAPE', 0)) : 0;
        let rmseValue = _get(fm, 'RMSE_perc') ? Number(_get(fm, 'RMSE_perc'), 0) : 0;
        rmseData.push(rmseValue);
        mapeData.push(mapeValue);
        const regressorList = _get(fm, 'Method') === 0 ? _get(fm, 'Regressors_list') : _get(fm, 'Regressors_list1');
        const regressorListString =  regressorList && regressorList.slice(1, regressorList.length - 1);
        const formatedregressorList = regressorListString && regressorListString.replace(/'/g, "");
        const tableVariableData = cleanEntityData({
            month: month,
            ['Promo Variable']: formatedregressorList,
            ['Regressor']: _get(fm, 'Regressors_flag'),
            ['Growth']: _get(fm, 'growth'),
            ['Seasonality Mode']: _get(fm, 'seasonality_mode'),
            ['Health Score']: _get(fm, 'health_score') ? _get(fm, 'health_score').toFixed(2) : undefined


        });
        return tableVariableData;

    });
    // console.log(rmseData, mapeData, labels);
    // adding months that doesnot has filed metrics



    _map(labels_check, (lc, index) => {
        const l1 = labels[index] ? labels[index].split('-')[1] : undefined;
        // console.log('l1', l1, labels, labels[index]);
        if (l1 && lc !== l1) {
            labels.splice(index, 0, `01-${lc}`);
            // console.log(labels, 'chaku');
            rmseData.splice(index, 0, 'NaN');
            mapeData.splice(index, 0, 'NaN');
        }
    });




    let keys = ['Promo Variable', 'Regressor', 'Growth', 'Seasonality Mode', 'Health Score'];
    let tableData = [];
    let headerData = [];
    // console.log('table variable', filedMetricData);
    let tableVariableDataToObj = enrichArrDataToObj({ data: filedMetricData, field: 'month' });
    tableData = _map(!_isEmpty(labels) && keys, (k, index) => {
        // console.log(tableVariableDataToObj);
        let childData = { Variable: k };

        _map(labels, l => {
            const monthLabel = l.split('-')[1];
            childData[`${monthLabel}`] = _get(tableVariableDataToObj, `${l}[${k}]`) || '-'
                // headerData.push({ 'field': l, header: l});

        })
        return childData;
        // return {
        //     variable: k,
        //     [`${labels[0]}`]: _get(filedMetricData, `0.${k}`),
        //     [`${labels[1]}`]: _get(filedMetricData, `1.${K}`),
        //     [`${labels[1]}`]: _get(filedMetricData, `1.${K}`),


        // }
    });
    _map(labels, l => {
        const monthLabel = l.split('-')[1];
        headerData.push({ 'field': monthLabel, header: monthLabel })
    });

    const newTableVariable = {
        data: tableData,
        headers: !_isEmpty(headerData) ? [{ 'field': 'Variable', 'header': 'Attributes' }, ...headerData] : [],
    };

    // removing date from labels
    const fianlLabels = !_isEmpty(labels) ? removeDateFromMonth({ data: labels }) : [];
    // end of date removal
    const response = { labels: fianlLabels, mapeData, rmseData, tableData: newTableVariable, tooltip: labels };
    return response;

};

const mapCountryDropdown = ({ data }) => _map(data, d => cleanEntityData({
    displayText: _get(d, 'Country_name'),
    value: _get(d, 'Country_code')
}));

const mapDistributionDropdown = ({ data }) => _map(data, d => cleanEntityData({
    displayText: _get(d, 'Distributor_ID_Name'),
    value: _get(d, 'Distributor_ID')
}));

const mapSkuDropdown = ({ data }) => _map(data, d => cleanEntityData({
    displayText: _get(d, 'SKU_Product_Name'),
    value: _get(d, 'SKU_Product')
}));

const mapPipelineDSDropdown = ({ data }) => _map(data, (d, index) => cleanEntityData({

    displayText: _get(d, 'name'),
    value: _get(d, '_id'),
    selected: ((index === 0) && (_get(d, 'name'))) ? true : false
}));



const mapfiledMetricDropdown = ({ country, distributor, sku, pipeline }) => {

    const countryDropdown = mapCountryDropdown({ data: country });
    const distDropdown = mapDistributionDropdown({ data: distributor });
    const skuDropdown = mapSkuDropdown({ data: sku });
    const pipelineRunDropdown = mapPipelineDSDropdown({ data: pipeline });

    const response = cleanEntityData({
        countryDropdown,
        distDropdown,
        skuDropdown,
        pipelineRunDropdown
    });


    return response;
};


const mapYearMonthDropdown = ({ data }) => _map(data, (d, index) => cleanEntityData({
    displayText: `${_get(d, 'CALENDER_YEAR')}-${_get(d, 'CALENDER_MONTH_NUMBER')}`,
    value: `${_get(d, 'CALENDER_YEAR')}-${_get(d, 'CALENDER_MONTH_NUMBER')}`,
    year: _get(d, 'CALENDER_YEAR'),
    month: _get(d, 'CALENDER_MONTH_NUMBER'),
    selected: index === 0 ? true : false
}));

const mapBusinessUserDropdown = ({ orderedYearMonth, country }) => {
    const yearMonthDropdown = mapYearMonthDropdown({ data: orderedYearMonth });
    const countryDropdown = mapCountryDropdown({ data: country });

    return {
        yearMonth: yearMonthDropdown,
        country: countryDropdown
    }

};

const mapBUTrendChart = ({ data, pipelineRuns, healthScoreData }) => {
    // // filter that data below the datetime supplied
    // // console.log(_get(data, '0._id'), 'final');
    // const sixMonthPreviousDate = moment.parseZone(_get(data, '0._id').toISOString()).subtract(5, 'months').startOf('month').toISOString();
    // // console.log('six', sixMonthPreviousDate);
    // const sixMonthPreviousYear = moment.parseZone(sixMonthPreviousDate).format("YYYY");
    // const sixMonthPreviousMonth = moment.parseZone(sixMonthPreviousDate).format("M");
    // const year = moment.parseZone(_get(data, '0._id').toISOString()).format("YYYY");
    // const month = moment.parseZone(_get(data, '0._id').toISOString()).format("M");
    // // console.log(sixMonthPreviousMonth, sixMonthPreviousYear, year, month)
    // const finalData = _filter(_get(data, '0.data'), (y) => {
    //     // console.log(y, 'final data');
    //     // console.log(_get(y, 'CALENDER_YEAR_ac'))
    //     if (_get(y, 'CALENDER_YEAR_ac') <= year && _get(y, 'CALENDER_YEAR_ac') >= sixMonthPreviousYear) {
    //         // console.log(_get(y, 'CALENDER_YEAR_ac'), 'check');
    //         if (_get(y, 'CALENDER_YEAR_ac') != year) {
    //             // console.log(_get(y, 'CALENDER_YEAR_ac'), 'check2');

    //             if ( _get(y, 'CALENDER_MONTH_NUMBER_ac') >= sixMonthPreviousMonth) {
    //                 // console.log('check3', _get(y, 'CALENDER_MONTH_NUMBER_ac'));
    //                 return y;
    //             }

    //             // return y;
    //         } else {
    //             if (_get(y, 'CALENDER_MONTH_NUMBER_ac') <= month ) {
    //                 // console.log('check4', _get(y, 'CALENDER_MONTH_NUMBER_ac'))
    //                 return y
    //             }
    //         }
    //     }
    // });

    // // console.log('finalData', finalData);
    // const orderedFinalData = _orderBy(finalData, ['CALENDER_YEAR_ac', 'CALENDER_MONTH_NUMBER_ac'], ['asc', 'asc']);

    // let baseLineChart = [];
    // let healthScoreLineChart = [];
    // let labels = [];
    // _map(orderedFinalData , o => {
    //     const months = _get(CONSTANTS, `months.${_get(o, 'CALENDER_MONTH_NUMBER_ac')}`);
    //     labels.push(months);
    //     baseLineChart.push(_get(o, 'baselinevsactual_ac'));
    //     healthScoreLineChart.push(_get(o, 'healthScore'));
    // });


    // new implementation
    // console.log(JSON.stringify(data));
    const latesBaseLineDateTime = _get(data, '0._id');
    const ascOrderedData = _orderBy(data, ['_id'], ['asc']);
    let baselineLables = [];
    const latestCutoffdate = moment.parseZone(_get(data, '0._id').toISOString()).subtract(1, 'months').toISOString();
    const baseLineChart = _reduce(ascOrderedData, (acc, val) => {
        const cutoffdate = moment.parseZone(_get(val, '_id').toISOString()).subtract(1, 'months').toISOString();
        const year = findYear({ date: cutoffdate}); // date
        const labelMonth = findMonthDate({ date: _get(val, '_id') });
        const month = findMonthNumber({ date: cutoffdate });
        // console.log(year, labelMonth, month);
        const mainDoc = _find(_get(val, 'data'), d => {
            // console.log(year, month, d);
            if (_get(d, 'CALENDER_YEAR') == year && _get(d, 'CALENDER_MONTH_NUMBER') == month) {
                // console.log('val', d);
                return d;
            }
        });
        // console.log('check', val._id, mainDoc, year, month);
        const data = _get(mainDoc, 'baselinevsactual') && isFinite(_get(mainDoc, 'baselinevsactual')) ? _get(mainDoc, 'baselinevsactual') : 0
        acc.push(data);
        baselineLables.push(labelMonth);
        return acc;

    }, []);
    

    const sixMonthPreviousDate = moment.parseZone(latesBaseLineDateTime).subtract(5, 'months').startOf('month');
    const lastestDate = _get(data, '0._id');
    // console.log(sixMonthPreviousDate, lastestDate);
    // let startDate = new Date(sixMonthPreviousDate);
    let startDate = sixMonthPreviousDate;
    const endDate = new Date(lastestDate);

    let labels_check = [];
    while (endDate >= startDate) {
        // console.log(startDate, 'startDate');
        const month = findMonth({ date: startDate });
        labels_check.push(month);
        startDate.add(1, 'months');
    };

    // adding months that doesnot has filed metrics
    // _map(labels_check, (lc, index) => {
    //     const l1 = baselineLables[index];
    //     // console.log('l1', l1, labels, labels[index]);
    //     if (l1 && lc !== l1) {
    //         baselineLables.splice(index, 0, lc);

    //         baseLineChart.splice(index, 0, 0);

    //     }
    // });

    _map(labels_check, (lc, index) => {
        const l1 = baselineLables[index] ? baselineLables[index].split('-')[1] : undefined;
        // console.log('l1', l1, labels, labels[index]);
        if (l1 && lc !== l1) {
            baselineLables.splice(index, 0, `01-${lc}`);
            baseLineChart.splice(index, 0, 'NaN');
        }
    });

    // creating health score data
    const latesHealthScoreDateTime = _get(healthScoreData, '0._id');
    const ascOrderedHealthScore = _orderBy(healthScoreData, ['_id'], ['asc']);
    const healthScoreLabels = [];
    const healthScoreChart = _reduce(ascOrderedHealthScore, (acc, val) => {
        // console.log('val', val);
        const labelMonth = findMonthDate({ date: _get(val, '_id') });
        healthScoreLabels.push(labelMonth);
        let sum = 0;
        let count = 0;
        _map(_get(val, 'data'), v => {
            let healthScore = _get(v, 'metrics.avg_health_score') ? _get(v, 'metrics.avg_health_score') : 0;
            sum += healthScore;
            count += 1;
        });
        const avg = sum / count;
        acc.push(avg);
        return acc;


    }, []);

    // console.log(healthScoreLabels, healthScoreChart);

    const sixMonthPreviousDateHS = moment.parseZone(_get(healthScoreData, '0._id').toISOString()).subtract(5, 'months').startOf('month');
    const lastestDateHS = _get(healthScoreData, '0._id');
    // console.log(sixMonthPreviousDate, lastestDate);
    // let startDate = new Date(sixMonthPreviousDate);
    let startDateHS = sixMonthPreviousDateHS;
    const endDateHS = new Date(lastestDateHS);

    let labels_checkHS = [];
    while (endDateHS >= startDateHS) {
        // console.log(startDate, 'startDate');
        const month = findMonth({ date: startDateHS });
        labels_checkHS.push(month);
        startDateHS.add(1, 'months');
    };

    // adding months that doesnot has filed metrics
    // _map(labels_checkHS, (lc, index) => {
    //     const l1 = healthScoreLabels[index];
    //     // console.log('l1', l1, labels, labels[index]);
    //     if (l1 && lc !== l1) {
    //         healthScoreLabels.splice(index, 0, lc);

    //         healthScoreChart.splice(index, 0, 0);

    //     }
    // });

    _map(labels_checkHS, (lc, index) => {
        const l1 = healthScoreLabels[index] ? healthScoreLabels[index].split('-')[1] : undefined;
        // console.log('l1', l1, labels, labels[index]);
        if (l1 && lc !== l1) {
            healthScoreLabels.splice(index, 0, `01-${lc}`);
            healthScoreChart.splice(index, 0, 'NaN');
        }
    });


    // end health score data


    // end of new implementation
    
    // remove date from months
        const finalBaseLineLabels = !_isEmpty(baselineLables) ? removeDateFromMonth({ data: baselineLables }) : [];
        const finalHealthScoreLabels = !_isEmpty(healthScoreLabels) ? removeDateFromMonth({ data: healthScoreLabels }): [];
    // end of date removal

    
    // console.log(baseLineChart);
    const response = {
        baseLineChart: {
            data: [{
                data: baseLineChart,
                tooltip: baselineLables,
            }],
            labels: finalBaseLineLabels
        },
        latesBaseLineDateTime,
        healthScoreChart: {
            data: [{
                data: healthScoreChart,
                tooltip: healthScoreLabels
            }],
            labels: finalHealthScoreLabels
        },
        latesHealthScoreDateTime
    }
    return response;

    // return {};

}



module.exports = {
    mapfiledMetricMatchQuery,
    mapFileMetricLineCharts,
    mapfiledMetricDropdown,
    mapBusinessUserDropdown,
    mapBUTrendChart,
    mapDistributionDropdown,
    mapSkuDropdown,
    mapCountryDropdown,
}