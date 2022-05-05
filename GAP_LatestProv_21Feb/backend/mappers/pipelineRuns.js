const { get: _get, map: _map, isEmpty: _isEmpty, reduce: _reduce, orderBy: _orderBy, uniq: _uniq } = require('lodash');
const { cleanEntityData, findMonth, findMonthDate, findMonthDateCheck, removeDateFromMonth } = require('../helpers/commonUtils');
const moment = require('moment');
const { start } = require('repl');
const { accessSync } = require('fs');

require("moment-duration-format");


const convertMSToMin = ({ timeInMs }) => {
    if (timeInMs) {
        const t = timeInMs / (1000 * 60);
        const t1 = t.toFixed(2);
        return t1;
    } else {
        return timeInMs;
    }
}

const dropdownMappers = ({ data }) => cleanEntityData({
    displayText: data,
    value: data
});

const mapPipelineRunsSearchResponse = ({ data, dropdowns }) => {
    const pipelineRuns = _map(data, d => cleanEntityData({
        id: _get(d, '_id'),
        pipelineName: _get(d, 'pipelineName'),
        runStart: _get(d, 'runStart'),
        runEnd: _get(d, 'runEnd'),
        // duration: _get(d, 'durationInMs') ? convertMSToMin({ timeInMs: _get(d, 'durationInMs') }) : '0',
        duration: _get(d, 'durationInMs') ? moment.duration(_get(d, 'durationInMs'), 'milliseconds').format("hh:mm:ss", { trim: false }) : '00:00:00',
        triggeredBy: _get(d, 'invokedBy.name'),
        status: _get(d, 'status'),
        runId: _get(d, 'runId'),
        message: _get(d, 'message'),
        disableGraph: _isEmpty(_get(d, 'pipelines_doc', [])) ? true : false
    }));

    const dropdownData = cleanEntityData({
        pipelineRuns: _map(_get(dropdowns, '[0].pipelineName'), d => dropdownMappers({ data: d })),
        runStartDate: _map(_get(dropdowns, '[0].runStart'), d => dropdownMappers({ data: d })),
        runEndDate: _map(_get(dropdowns, '[0].runEnd'), d => dropdownMappers({ data: d })),
        status: _map(_get(dropdowns, '[0].status'), d => dropdownMappers({ data: d }))
    });
    return {
        pipelineRuns,
        dropdownData
    };
};


const mapProphetMiscResponse = ({ data }) => {
    // const orderedData = _orderBy(data, ['metrics.cutoffdate_qc'], ['asc']);

    // let labels = [];
    // // console.log(data);
    // // console.log(_get(data, '0.metrics.cutoffdate_qc'), 'date');
    // const latestDate = _get(data, '0.metrics.cutoffdate_qc').toISOString();
    // const sixMonthPreviousDate = moment.parseZone(latestDate).subtract(5, 'months').startOf('month');
    // // const lastestDate = _get(latestFiledMetric, 'datetime');
    // // console.log(sixMonthPreviousDate, lastestDate);
    // // let startDate = new Date(sixMonthPreviousDate);
    // let startDate = sixMonthPreviousDate;
    // const endDate = new Date(latestDate);
    // let labels_check = [];
    // while (endDate >= startDate) {
    //     // console.log(startDate, 'startDate');
    //     const month = findMonth({ date: startDate });
    //     labels_check.push(month);
    //     startDate.add(1, 'months');
    // };
    // // console.log(latestDate, startDate, labels_check);

    // let reducedData = _reduce(orderedData, (acc, val) => {
    //     const month = findMonthDateCheck({ date: _get(val, 'metrics.cutoffdate_qc') });
    //     labels.push(month);
    //     let miscSum = Number(_get(val, 'metrics.Merged_Output_Intersection_Count')) || 0;
    //     let prophetSum = Number(_get(val, 'metrics.Output_After_Capping_Intersection_Count')) || 0;
    //     // _map(_get(val, 'data'), v => {
    //     //     miscSum += Number(_get(v, 'metrics.Final_Missing_output_Intersection_Count')) || 0;
    //     //     prophetSum += Number(_get(v, 'metrics.Merged_Output_Intersection_Count')) || 0;
    //     // });
    //     // console.log('sum', prophetSum, miscSum);
    //     const total = prophetSum + miscSum;
    //     const prophetPercent = prophetSum / total;
    //     const miscPercent = miscSum / total;
    //     acc.prophet.push(prophetPercent);
    //     acc.misc.push(miscPercent);
    //     return acc;

    // }, { prophet: [], misc: [] });
    // // console.log('reduced Data', reducedData, labels);



    const latestProphetMiscDateTime = _get(data, '0._id');
    const orderedData = _orderBy(data, ['_id'], ['asc']);

    let labels = [];
    // console.log(data);
    // console.log(_get(data, '0.metrics.cutoffdate_qc'), 'date');
    const latestDate = _get(data, '0._id').toISOString();
    const sixMonthPreviousDate = moment.parseZone(latestDate).subtract(5, 'months').startOf('month');
    // const lastestDate = _get(latestFiledMetric, 'datetime');
    // console.log(sixMonthPreviousDate, lastestDate);
    // let startDate = new Date(sixMonthPreviousDate);
    let startDate = sixMonthPreviousDate;
    const endDate = new Date(latestDate);
    let labels_check = [];
    while (endDate >= startDate) {
        // console.log(startDate, 'startDate');
        const month = findMonth({ date: startDate });
        labels_check.push(month);
        startDate.add(1, 'months');
    };
    // console.log(latestDate, startDate, labels_check);

    let reducedData = _reduce(orderedData, (acc, val) => {
        let prophetSum = 0;
        let miscSum = 0;

        const month = findMonthDate({ date: _get(val, '_id') });
        labels.push(month);

        _map(_get(val, 'data'), d => {
            miscSum += Number(_get(d, 'metrics.Final_Missing_output_Intersection_Count')) || 0;
            prophetSum += Number(_get(d, 'metrics.Output_After_Capping_Intersection_Count')) || 0;
        })
        const total = prophetSum + miscSum;
        // console.log('sum', total, prophetSum);
        const prophetPercent = prophetSum / total;
        const miscPercent = miscSum / total;
        acc.prophet.push(prophetPercent);
        acc.misc.push(miscPercent);
        acc.prophetValue.push(prophetSum);
        acc.miscValue.push(miscSum);
        return acc;

    }, { prophet: [], misc: [], prophetValue: [], miscValue: [] });
    // console.log('reduced Data', reducedData, labels);

    // adding months that doesnot has filed metrics
    _map(labels_check, (lc, index) => {
        const l1 = labels[index] ? labels[index].split('-')[1] : undefined;
        // console.log('l1', l1, labels, labels[index]);
        if (l1 && lc !== l1) {
            labels.splice(index, 0, `01-${lc}`);
            // console.log(labels, 'chaku');
            reducedData.prophet.splice(index, 0, 0);
            reducedData.misc.splice(index, 0, 0);
            reducedData.prophetValue.splice(index, 0, 0);
            reducedData.miscValue.splice(index, 0, 0);
        }
    });

    // removal of date from labels

    const finalLabels = !_isEmpty(labels) ? removeDateFromMonth({ data: labels }) : [];

    // end of date removal

    const response = {
        chart: [
            { data: _get(reducedData, 'prophet'), tooltip: _get(reducedData, 'prophetValue') },
            { data: _get(reducedData, 'misc'), tooltip: _get(reducedData, 'miscValue') },
        ],
        labels: finalLabels,
        latestProphetMiscDateTime
    };
    return response;
}
module.exports = {
    mapPipelineRunsSearchResponse,
    mapProphetMiscResponse,
};