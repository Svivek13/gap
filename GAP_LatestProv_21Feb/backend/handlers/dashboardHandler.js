const { get: _get, map: _map, isEmpty: _isEmpty, orderBy: _orderBy, filter: _filter, flattenDeep: _flattenDeep, find: _find } = require('lodash');
const moment = require('moment');
const { baseHandler } = require('../private/base-handler');
const { CONSTANTS } = require('../helpers/constant');
const { cleanEntityData } = require('../helpers/commonUtils');
const { filedMetricFind, filedMetricFindOne, filedMetricAggregate, latestFiledMetrcFind, filedMetricFindOptions } = require('../models/filedMetric');
// const { pipelineRunAggregate } = require('../models/pipelineRun');
const { countryMappingFind, countryMappingFindOne } = require('../models/countryMapping');
const { distributionMappingFind, distributionMappingFindOne } = require('../models/distributorMapping');
const { skuMappingFind, skuMappingFindOne } = require('../models/skuMapping');
const { pipelineFind, pipelineFindOne } = require('../models/pipeline');
const { mapfiledMetricMatchQuery, mapFileMetricLineCharts, mapfiledMetricDropdown, mapBusinessUserDropdown, mapBUTrendChart, mapDistributionDropdown, mapSkuDropdown } = require('../mappers/filedMetric');
const { filedMetric_MAPE_RMSEAggregateQuery, mapBusinessUserQuery, mapBusinessUserAggregatedQuery, mapBUHealthScoreQuery } = require('../queryBuilder/filedMetric');
const { mapProphetMiscAggregateQuery, mapPipelineRunDSQuery, mapPipelineRunBUQuery, DEPipelineRunsAggregateQuery, prophetPipelineRunChildQuery } = require('../queryBuilder/pipelineRun');
const { pipelineRunAggregate, pipelineRunsFindOne, pipelineRunsFind } = require('../models/pipelineRun');
const { mapProphetMiscResponse } = require('../mappers/pipelineRuns');
const { mapDataDriftQuery } = require('../queryBuilder/dataDrift');
const { dataDriftMetricFind, dataDriftMetricFindWithOptions, dataDriftMetricFindOne } = require('../models/dataDrift');
const { mapDriftResponse, mapDataDriftFeature } = require('../mappers/dataDrift');
const { mapPipelineDSDropdownQuery } = require('../mappers/pipeline');
const { dataDriftTrainFind } = require('../models/dataDriftTrain');
const { dataDriftTestFind } = require('../models/dataDriftTest');
const { featureDetailResponse } = require('../helpers/mockData/driftDetail');
const { dataEngineerMetricFindOne } = require('../models/dataEngMetrics');
const { mapDataEngineerData } = require('../mappers/dataEngineerMetric');


const mapPipelineRunResponse = ({ data }) => _map(data, d => {
    const sortedDocs = _orderBy(_get(d, 'docs'), ['doc.runStart'], ['desc']);
    return _get(sortedDocs, '0.doc');
    // return cleanEntityData({
    //     yearMonth: _get(d, '_id'),
    //     docs : _get(sortedDocs, '0')
    // });
    // console.log(sortedDocs);

});

const pipelineRunDSData = async({ data }) => {
    const pipelineRunDSQuery = mapPipelineRunDSQuery({ data, limit: 6 });
    // console.log(JSON.stringify(pipelineRunDSQuery));
    const sixMonthPipelineRunData = await pipelineRunAggregate({ query: pipelineRunDSQuery });
    // console.log('data', JSON.stringify(sixMonthPipelineRunData));



    if (_isEmpty(sixMonthPipelineRunData)) {
        return {};
    }
    const mappedData = mapPipelineRunResponse({ data: sixMonthPipelineRunData });
    // console.log(JSON.stringify(mappedData));

    // const latestPipelineRunDate = _get(mappedData, '0.docs.doc.runStart');
    // const previousDate = moment.parseZone(latestPipelineRunDate.toISOString()).subtract(5, 'months').startOf('month').toISOString();
    // // console.log(latestPipelineRunDate, previousDate, 'check', JSON.stringify(sixMonthPipelineRunData));
    // let lastSixMonthchildPipeline = [];
    // const lastSixMonthOnlyData = _map( sixMonthPipelineRunData, (d) => {
    //     const d1 = new Date(previousDate);
    //     const d2 = new Date(_get(d, 'runStart'));
    //     if (d1 <= d2) {
    //         const childPipelines = _get(d, 'child_pipeline_details.all_child_pipelines') ?  _get(d, 'child_pipeline_details.all_child_pipelines') : [];
    //         lastSixMonthchildPipeline.push(childPipelines);
    //     }
    // });

    let lastSixMonthchildPipeline = [];
    _map(mappedData, m => {
        const childPipelines = _get(m, 'child_pipeline_details.all_child_pipelines') ? _get(m, 'child_pipeline_details.all_child_pipelines') : [];
        lastSixMonthchildPipeline.push(childPipelines);
    });

    lastSixMonthchildPipeline = _flattenDeep(lastSixMonthchildPipeline);
    return { lastSixMonthchildPipeline, sixMonthPipelineRunData: mappedData }

}


const pipelineRunBUData = async({ data }) => {
    const pipelineRunBUQuery = mapPipelineRunBUQuery({ data, limit: 6 });
    const latestPipelineRunData = await pipelineRunAggregate({ query: pipelineRunBUQuery });
    if (_isEmpty(latestPipelineRunData)) {
        return {};
    };

    const mappedData = mapPipelineRunResponse({ data: latestPipelineRunData });
    let latestchildPipeline = [];
    const latestChildData = _map(mappedData, (d) => {

        const childPipelines = _get(d, 'child_pipeline_details.all_child_pipelines') ? _get(d, 'child_pipeline_details.all_child_pipelines') : [];
        latestchildPipeline.push(childPipelines);

    });
    latestChildPipeline = _flattenDeep(latestchildPipeline);
    // console.log(latestchildPipeline);
    // console.log(JSON.stringify(mappedData));
    return { latestChildPipeline, latestPipelineRunData: mappedData }


}

const roles = {
    [`${_get(CONSTANTS, 'roles.dataScientist')}`]: async({ body }) => {

        const pipelineRunQuery = await pipelineRunDSData({ data: body });

        if (_isEmpty(pipelineRunQuery)) {
            return {};
        }
        // console.log(JSON.stringify(pipelineRunQuery));

        // parenntRunIdQuery = {}
        // initial query
        const initialQuery = cleanEntityData({
            pipelineRunId: !_isEmpty(_get(pipelineRunQuery, 'lastSixMonthchildPipeline')) ? { "$in": _get(pipelineRunQuery, 'lastSixMonthchildPipeline') } : undefined,
            file_name: _get(CONSTANTS, 'fileName.parameter')
        });
        // console.log(initialQuery, 'init');
        const latestFiledMetric = await latestFiledMetrcFind(initialQuery);
        const latestPipelineruns = _get(pipelineRunQuery, 'sixMonthPipelineRunData.0');
        const latestPipelineRunDatetime = _get(latestPipelineruns, 'runEnd');
        // console.log('data', JSON.stringify(latestFiledMetric));
        if (_isEmpty(latestFiledMetric)) {
            return {};
        }
        // const selectionQuery = {
        //     country: _get(latestFiledMetric, '0.country'),
        //     dist: _get(latestFiledMetric, '0.dist'),
        //     sku: _get(latestFiledMetric, '0.sku')
        // };

        // Using this temporarily, has to be made dynamic later
        const selectionQuery = {
            country: '7002',
            dist: '40012826',
            sku: '17794626009195'
        };

        const filedMetricMatchQuery = mapfiledMetricMatchQuery({ data: body, selectionQuery, childPiplineRuns: _get(pipelineRunQuery, 'lastSixMonthchildPipeline') });
        // console.log('match query', filedMetricMatchQuery);
        const filedMetricQuery = filedMetric_MAPE_RMSEAggregateQuery({ matchQuery: filedMetricMatchQuery });
        // console.log(JSON.stringify(filedMetricQuery), 'file');
        const filedMetrics = await filedMetricAggregate(filedMetricQuery);
        // console.log('response', JSON.stringify(filedMetrics));
        if (_isEmpty(filedMetrics)) {
            return {};
        }



        const lineCharts = mapFileMetricLineCharts({ filedMetric: filedMetrics, latestFiledMetric: _get(latestFiledMetric, '0') });
        // data drift

        // const selectedDropdown = _get(lineCharts, 'selectedDropdown');
        // console.log(selectionQuery, _get(pipelineRunQuery, 'sixMonthPipelineRunData'));
        const driftQuery = mapDataDriftQuery({ selectionQuery, pipelineRunData: _get(pipelineRunQuery, 'sixMonthPipelineRunData') });
        // console.log('query', driftQuery);
        const queryOptions = { limit: 6, sort: { datetime: -1 } };
        const driftData = await dataDriftMetricFindWithOptions({ query: driftQuery, field: null, options: queryOptions });
        // console.log(JSON.stringify(driftData));
        // let driftData = [];
        let driftResponse;
        let driftPipelineRunsDatetime;
        if (_isEmpty(driftData)) {
            driftResponse = {};
        } else {
            driftResponse = mapDriftResponse({ data: driftData });
            const latestDriftData = _get(driftData, '0');

            const driftLatestPipelineRuns = _find(_get(pipelineRunQuery, 'sixMonthPipelineRunData'), ['_id', _get(latestDriftData, 'pipelineRunId')]);
            driftPipelineRunsDatetime = _get(driftLatestPipelineRuns, 'runEnd');

        }
        // const orderedDriftData = _orderBy(driftData, ['datetime'], ['desc']);


        const country = await countryMappingFindOne({ Country_code: _get(selectionQuery, 'country') });
        const dist = await distributionMappingFind({ Country: _get(country, 'Country_code') });
        const sku = await skuMappingFindOne({ Distributor_ID: _get(selectionQuery, 'dist'), SKU_Product: _get(selectionQuery, 'sku') });
        // distributionMappingFind({ Distributor_ID: _get(selectionQuery, 'dist')}),
        // skuMappingFind({ SKU_Product: _get(selectionQuery, 'sku')})

        // console.log(selectionQuery);

        // console.log(country, dist);

        const dropDownsSelected = mapfiledMetricDropdown({ country, distributor: dist, sku });
        // console.log(dropDownsSelected);



        const partialResponse = cleanEntityData({

            selectedDropdown: selectionQuery,
            dropdownDetails: cleanEntityData({
                country: _get(dropDownsSelected, 'countryDropdown', []),
                distribution: _get(dropDownsSelected, 'distDropdown', []),
                sku: _get(dropDownsSelected, 'skuDropdown', [])
            }),

            latestFiledMetric: _get(latestFiledMetric, '0'),
            driftPipelineRunsDatetime,
            latestPipelineRunDatetime

        });


        const finalResponse = {
            dashboardData: {
                ...partialResponse,
                rmseData: {
                    data: [{ data: _get(lineCharts, 'rmseData'), tooltip: _get(lineCharts, 'tooltip') }],
                    labels: _get(lineCharts, 'labels')
                },
                mapeData: {
                    data: [{ data: _get(lineCharts, 'mapeData'), tooltip: _get(lineCharts, 'tooltip') }],
                    labels: _get(lineCharts, 'labels'),
                },
                tableVariables: _get(lineCharts, 'tableData'),
                driftData: driftResponse,
            }
        };
        return finalResponse;


    },
    [`${_get(CONSTANTS, 'roles.businessUser')}`]: async({ body }) => {
        // const query = mapBusinessUserQuery({ data: body });
        // console.log('business query', query);
        const pipelineRunQuery = await pipelineRunBUData({ data: body });

        if (_isEmpty(pipelineRunQuery)) {
            return {};
        }

        const latestPipelineruns = _get(pipelineRunQuery, 'latestPipelineRunData.0');
        const latestPipelineRunDatetime = _get(latestPipelineruns, 'runEnd');

        // initial query
        const initialQuery = cleanEntityData({
            pipelineRunId: !_isEmpty(_get(pipelineRunQuery, 'latestChildPipeline')) ? { "$in": _get(pipelineRunQuery, 'latestChildPipeline') } : undefined,
            file_name: _get(CONSTANTS, 'fileName.qc')
        });
        // console.log(initialQuery, 'init');
        const latestFiledMetric = await filedMetricFindOptions({ query: initialQuery, field: null, options: { sort: { datetime: -1 } } });
        // console.log(latestFiledMetric);
        if (_isEmpty(latestFiledMetric)) {
            return {};
        }
        // console.log(initialQuery, 'check');
        const selectionQuery = {
            country: _get(latestFiledMetric, '0.country'),
        };

        const aggregatedQuery = mapBusinessUserAggregatedQuery({ data: body, selectionQuery, childPiplineRuns: _get(pipelineRunQuery, 'latestChildPipeline') });
        // console.log(JSON.stringify(aggregatedQuery));
        // const businessUserData = await latestFiledMetrcFind(query);
        const businessUserData = await filedMetricAggregate(aggregatedQuery);
        // console.log('work', JSON.stringify(businessUserData));
        if (_isEmpty(businessUserData)) {
            return {};
        }

        // bu health score query
        const healthScoreQuery = mapBUHealthScoreQuery({ selectionQuery, pipelineRuns: _get(pipelineRunQuery, 'latestChildPipeline') });
        // console.log(JSON.stringify(healthScoreQuery));
        const healthScoreData = await pipelineRunAggregate({ query: healthScoreQuery });

        // end bu health score query
        const trendChart = mapBUTrendChart({ data: businessUserData, pipelineRuns: _get(pipelineRunQuery, 'latestPipelineRunData'), healthScoreData });
        // console.log(JSON.stringify(healthScoreData));
        const finalResponse = {
            ...trendChart,
            dropdownDetails: cleanEntityData({
                country: _get(selectionQuery, 'country')
            }),
            latestPipelineRunDatetime

        };
        return finalResponse;
        // return aggregatedQuery;
    },
    [`${_get(CONSTANTS, 'roles.dataEngineer')}`]: async({ body }) => {
        const pipelineRuns = await pipelineRunsFind({ pipelineId: _get(CONSTANTS, 'dataEngineer.pipelineRuns.id') });
        // console.log(JSON.stringify(pipelineRuns));
        if (_isEmpty(pipelineRuns)) {
            return {};
        }
        const latestPipelineruns = _get(pipelineRuns, '0');

        const month = moment.utc(_get(latestPipelineruns, 'runStart')).month();
        const year = moment.utc(_get(latestPipelineruns, 'runStart')).year();
        latestMonth = month + 1;
        latestYear = year;

        // const query = DEMetricAggregateQuery({ year: latestYear, month: latestMonth, pipelineRunId: _get(latestPipelineruns, '_id')});
        const query = {
            pipelineRunId: _get(latestPipelineruns, '_id')
        };

        const dataEngineerData = await dataEngineerMetricFindOne(query);

        const latestPipelineRunDatetime = _get(latestPipelineruns, 'runEnd');

        const pipelineName = _get(CONSTANTS, 'dataEngineer.pipelineRuns.name');

        const response = mapDataEngineerData({ data: dataEngineerData, year: latestYear, month: latestMonth, latestPipelineRunDatetime, pipelineName });
        return response;
    }
}

const dashboardHelper = async({ body }) => {

    const dashboardRole = roles[_get(body, 'role')];
    const dashboardResponse = await dashboardRole({ body });

    return { content: dashboardResponse };
}

const dashboardHandler = async options => baseHandler(dashboardHelper, options);


const dataSceinceDropdownHelper = async() => {
    const pipelineQuery = mapPipelineDSDropdownQuery();
    const [pipeline, country] = await Promise.all([
        pipelineFind({ getFields: pipelineQuery }),
        countryMappingFind({}),
        // distributionMappingFind({}),
        // skuMappingFind({})

    ]);

    // console.log(pipeline);
    const dropDowns = mapfiledMetricDropdown({ country, pipeline });
    const response = cleanEntityData({
        pipelineRun: _get(dropDowns, 'pipelineRunDropdown'),
        // distribution: _get(dropDowns, 'distDropdown'),
        // sku: _get(dropDowns, 'skuDropdown'),
        country: _get(dropDowns, 'countryDropdown')


    });
    return { content: response };
}

const dataSceinceDropdownHandler = async options => baseHandler(dataSceinceDropdownHelper, options);


const businessUserDropdownHelper = async() => {

    const pipelineQuery = mapPipelineDSDropdownQuery();
    const [pipeline, country] = await Promise.all([
        pipelineFind({ getFields: pipelineQuery }),
        countryMappingFind({}),

    ]);

    const dropDowns = mapfiledMetricDropdown({ country, pipeline });
    const response = cleanEntityData({
        pipelineRun: _get(dropDowns, 'pipelineRunDropdown'),
        country: _get(dropDowns, 'countryDropdown')
    });
    return response;
    // const query = {
    //     file_name: _get(CONSTANTS, 'fileName.qc'),

    // };
    // // console.log('query', query);
    // const filedMetricResponse = await latestFiledMetrcFind(query);

    // if (_isEmpty(filedMetricResponse) && _isEmpty(_get(filedMetricResponse, '0.datetime'))) {

    //     return { content: []};
    // }

    // const nextQuery = {
    //     datetime: _get(filedMetricResponse, '0.datetime'),
    //     file_name: _get(CONSTANTS, 'fileName.qc')
    // };
    // // console.log(nextQuery, 'next');
    // const  [yearMonth, country] = await Promise.all([
    //     filedMetricFind(nextQuery),
    //     countryMappingFind({}),

    // ]);

    // // filter that data below the datetime supplied
    // const year = moment.parseZone(_get(filedMetricResponse, '0.datetime')).format("YYYY");
    // const month = moment.parseZone(_get(filedMetricResponse, '0.datetime')).format("M");
    // const finalYearMonth = _filter(yearMonth, (y) => {
    //     if (_get(y, 'CALENDER_YEAR') <= year) {
    //         // console.log(_get(y, 'CALENDER_YEAR_ac'));
    //         if (_get(y, 'CALENDER_YEAR') != year) {
    //             // console.log(_get(y, 'CALENDER_YEAR_ac'));

    //             return y;
    //         } else {
    //             if (_get(y, 'CALENDER_MONTH_NUMBER') <= month) {
    //                 return y
    //             }
    //         }
    //     }
    // });
    // const orderedYearMonth = _orderBy(finalYearMonth, ['CALENDER_YEAR', 'CALENDER_MONTH_NUMBER'], ['desc', 'desc']);
    // const businessUserDropdown = mapBusinessUserDropdown({ orderedYearMonth, country });
    // return { content: businessUserDropdown};

    // console.log(filedMetricResponse, 'response');

}

const businessUserDropdownHandler = async options => baseHandler(businessUserDropdownHelper, options);

const pipelineRunProphetData = async({ pipelineName }) => {
    const pipelineRunProphetQuery = prophetPipelineRunChildQuery({ pipelineName, limit: 6 });
    // console.log(JSON.stringify(pipelineRunProphetQuery));
    const sixMonthPipelineRunData = await pipelineRunAggregate({ query: pipelineRunProphetQuery });
    // console.log('data', JSON.stringify(sixMonthPipelineRunData));



    if (_isEmpty(sixMonthPipelineRunData)) {
        return {};
    }
    const mappedData = mapPipelineRunResponse({ data: sixMonthPipelineRunData });
    

    let lastSixMonthchildPipeline = [];
    _map(mappedData, m => {
        const childPipelines = _get(m, 'child_pipeline_details.all_child_pipelines') ? _get(m, 'child_pipeline_details.all_child_pipelines') : [];
        lastSixMonthchildPipeline.push(childPipelines);
    });

    lastSixMonthchildPipeline = _flattenDeep(lastSixMonthchildPipeline);
    return { lastSixMonthchildPipeline, sixMonthPipelineRunData: mappedData }

}



const dashboardProphetHelper = async({ body }) => {
    // const pipelineRunsForChild = await pipelineRunsFind({ pipelineName: 'Sequential_Run'});
    // const pipelineRunChilds = _map(pipelineRunsForChild, p => _get( p, 'child_pipeline_details.all_child_pipelines'));

    const [pipelineData, pipelineRunQuery] = await Promise.all([
        pipelineFindOne({ _id: _get(body, 'pipelineId') }),
        pipelineRunProphetData({ pipelineName: _get(CONSTANTS, 'mainPipeline.name') }),
    ]);

    if (_isEmpty(pipelineRunQuery)) {
        return {};
    }

    
    const prophetMiscQuery = mapProphetMiscAggregateQuery({ data: body, pipeline: pipelineData, limit: 6, pipelineIds: _get(pipelineRunQuery, 'lastSixMonthchildPipeline') });
    // console.log('query', JSON.stringify(prophetMiscQuery));
    const prophetMiscData = await pipelineRunAggregate({ query: prophetMiscQuery });
    // console.log(JSON.stringify(prophetMiscData));

    if (_isEmpty(prophetMiscData)) {
        return { content: {} };
    }

    const prophetMiscResponse = mapProphetMiscResponse({ data: prophetMiscData });
    return { content: prophetMiscResponse };
}
const dashboardProphetHandler = async options => baseHandler(dashboardProphetHelper, options);


const filterRoles = {
    [`${_get(CONSTANTS, 'roles.dataScientist')}`]: async({ body }) => {

        const country = _get(body, 'country') ? _get(body, 'country').toString() : undefined;
        const dist = _get(body, 'dist') ? _get(body, 'dist').toString() : undefined;
        const sku = _get(body, 'sku') ? _get(body, 'sku').toString() : undefined;

        const reqData = cleanEntityData({
            role: _get(body, 'role'),
            pipelineId: _get(body, 'pipelineId'),
            country,
            dist,
            sku
        });

        const pipelineRunQuery = await pipelineRunDSData({ data: reqData });

        if (_isEmpty(pipelineRunQuery)) {
            return {};
        }

        const latestPipelineruns = _get(pipelineRunQuery, 'sixMonthPipelineRunData.0');
        const latestPipelineRunDatetime = _get(latestPipelineruns, 'runEnd');

        const filedMetricMatchQuery = mapfiledMetricMatchQuery({ data: reqData, childPiplineRuns: _get(pipelineRunQuery, 'lastSixMonthchildPipeline') });
        const filedMetricQuery = filedMetric_MAPE_RMSEAggregateQuery({ matchQuery: filedMetricMatchQuery });
        // console.log('response', filedMetricMatchQuery);
        const filedMetrics = await filedMetricAggregate(filedMetricQuery);
        if (_isEmpty(filedMetrics)) {
            return {};
        }
        const latestFiledMetric = _get(filedMetrics, '0');
        // console.log(latestFiledMetric, 'checking');
        const lineCharts = mapFileMetricLineCharts({ filedMetric: filedMetrics, latestFiledMetric });

        // data drift



        const selectedDropdown = cleanEntityData({
            country,
            dist,
            sku
        });
        const driftQuery = mapDataDriftQuery({ selectionQuery: selectedDropdown, pipelineRunData: _get(pipelineRunQuery, 'sixMonthPipelineRunData') });
        const queryOptions = { limit: 6, sort: { datetime: -1 } };
        // console.log(driftQuery);
        const driftData = await dataDriftMetricFindWithOptions({ query: driftQuery, field: null, options: queryOptions });
        // console.log(driftData);
        // const driftData = await dataDriftMetricFind(driftQuery);
        let driftResponse;
        let driftPipelineRunsDatetime;
        if (_isEmpty(driftData)) {
            driftResponse = {};
        } else {
            driftResponse = mapDriftResponse({ data: driftData });
            const latestDriftData = _get(driftData, '0');

            const driftLatestPipelineRuns = _find(_get(pipelineRunQuery, 'sixMonthPipelineRunData'), ['_id', _get(latestDriftData, 'pipelineRunId')]);
            driftPipelineRunsDatetime = _get(driftLatestPipelineRuns, 'runEnd');
        }
        // const orderedDriftData = _orderBy(driftData, ['datetime'], ['desc']);








        const finalResponse = {
            dashboardData: {

                rmseData: {
                    data: [{ data: _get(lineCharts, 'rmseData'), tooltip: _get(lineCharts, 'tooltip') }],
                    labels: _get(lineCharts, 'labels')
                },
                mapeData: {
                    data: [{ data: _get(lineCharts, 'mapeData'), tooltip: _get(lineCharts, 'tooltip') }],
                    labels: _get(lineCharts, 'labels'),
                },
                tableVariables: _get(lineCharts, 'tableData'),
                driftData: driftResponse,
                latestFiledMetric,
                driftPipelineRunsDatetime,
                latestPipelineRunDatetime
            }
        };
        return finalResponse;


    },
    [`${_get(CONSTANTS, 'roles.businessUser')}`]: async({ body }) => {
        const country = _get(body, 'country') ? _get(body, 'country').toString() : undefined;

        const reqData = cleanEntityData({
            country,
            pipelineId: _get(body, 'pipelineId'),
            role: _get(body, 'role')
        });
        const pipelineRunQuery = await pipelineRunBUData({ data: reqData });

        if (_isEmpty(pipelineRunQuery)) {
            return {};
        }

        const latestPipelineruns = _get(pipelineRunQuery, 'latestPipelineRunData.0');
        const latestPipelineRunDatetime = _get(latestPipelineruns, 'runEnd');

        const aggregatedQuery = mapBusinessUserAggregatedQuery({ data: reqData, childPiplineRuns: _get(pipelineRunQuery, 'latestChildPipeline') });
        // console.log(JSON.stringify(aggregatedQuery));
        // const businessUserData = await latestFiledMetrcFind(query);
        const businessUserData = await filedMetricAggregate(aggregatedQuery);
        if (_isEmpty(businessUserData)) {
            return {};
        }

        const selectionQuery = {
            country
        };
        // bu health score query
        const healthScoreQuery = mapBUHealthScoreQuery({ selectionQuery, pipelineRuns: _get(pipelineRunQuery, 'latestChildPipeline') });
        const healthScoreData = await pipelineRunAggregate({ query: healthScoreQuery });

        // console.log(JSON.stringify(healthScoreData), 'check');

        // end bu health score query
        const trendChart = mapBUTrendChart({ data: businessUserData, pipelineRuns: _get(pipelineRunQuery, 'latestPipelineRunData'), healthScoreData });

        const response = {
            ...trendChart,
            latestPipelineRunDatetime
        };
        return response;
    },
    [`${_get(CONSTANTS, 'roles.dataEngineer')}`]: async({ body }) => {
        latestMonth = _get(body, 'month');
        latestYear = _get(body, 'year');

        const pipelineRunQuery = DEPipelineRunsAggregateQuery({ year: latestYear, month: latestMonth, pipelineId: _get(CONSTANTS, 'dataEngineer.pipelineRuns.id') });

        const pipelineRuns = await pipelineRunAggregate({ query: pipelineRunQuery });

        if (_isEmpty(pipelineRuns)) {
            return {};
        }
        const latestPipelineruns = _get(pipelineRuns, '0');




        const query = {
            pipelineRunId: _get(latestPipelineruns, 'doc._id')
        };


        const dataEngineerData = await dataEngineerMetricFindOne(query);

        const latestPipelineRunDatetime = _get(latestPipelineruns, 'doc.runEnd');
        const pipelineName = _get(CONSTANTS, 'dataEngineer.pipelineRuns.name');

        const response = mapDataEngineerData({ data: dataEngineerData, latestPipelineRunDatetime, year: latestYear, month: latestMonth, pipelineName });
        return response;
        // return pipelineRuns;
    }

}

const dashboardFilterHelper = async({ body }) => {
    const dashboardRole = filterRoles[_get(body, 'role')];
    const dashboardResponse = await dashboardRole({ body });

    return { content: dashboardResponse };
}

const dashboardFilterHandler = async options => baseHandler(dashboardFilterHelper, options);

const distributionDropdownHelper = async({ country }) => {
    const query = {
        Country: country
    };

    const dist = await distributionMappingFind(query);
    const response = mapDistributionDropdown({ data: dist });
    return response;
};

const distributionDropdownHandler = async options => baseHandler(distributionDropdownHelper, options);

const skuDropdownHelper = async({ dist }) => {
    const query = {
        Distributor_ID: dist
    };
    const sku = await skuMappingFind(query);
    const response = mapSkuDropdown({ data: sku });
    return response;
}
const skuDropdownHandler = async options => baseHandler(skuDropdownHelper, options);


const dashboardDriftFeatureHelper = async({ body }) => {

    // mock integrations

    // return { content: featureDetailResponse };

    // end mock integrations

    const pipelineRunData = await pipelineRunsFindOne({
        _id: _get(body, 'pipelineRunId')
    });

    const pipelineRunChildData = _get(pipelineRunData, 'child_pipeline_details.all_child_pipelines') ? _get(pipelineRunData, 'child_pipeline_details.all_child_pipelines') : [];
    const filedMetricQuery = cleanEntityData({
        country: _get(body, 'country'),
        sku: _get(body, 'sku'),
        dist: _get(body, 'dist'),
        pipelineRunId: !_isEmpty(pipelineRunChildData) ? { $in: pipelineRunChildData } : [],
        file_name: _get(CONSTANTS, 'fileName.parameter'),
    });


    const filedMetricData = await filedMetricFindOne(filedMetricQuery);
    // console.log(filedMetricData);

    if (_isEmpty(filedMetricData)) {
        return { content: {} };
    }

    const dataDriftMetricQuery = cleanEntityData({
        pipelineRunId: _get(body, 'pipelineRunId'),
        EAN: _get(body, 'sku'),
        Sold_To: _get(body, 'dist'),
        Country: _get(body, 'country')
    });

    const dataDriftMetricData = await dataDriftMetricFindOne(dataDriftMetricQuery);
    // console.log(dataDriftMetricData);

    const driftTrainQuery = cleanEntityData({
        pipelineRunId: _get(body, 'pipelineRunId'),
        EAN: parseInt(_get(body, 'sku', 0), 10),
        Sold_To: parseInt(_get(body, 'dist', 0), 10),
        country: parseInt(_get(body, 'country', 0), 10)
    });
    const driftTrainData = await dataDriftTrainFind(driftTrainQuery);

    const driftTestData = await dataDriftTestFind(driftTrainQuery);


    const response = mapDataDriftFeature({ filedMetricData, dataDriftMetricData, driftTrainData, driftTestData })

    // console.log(JSON.stringify(dataDriftTrainData), dataDriftTrainQuery);;
    return { content: response };

}

const dashboardDriftFeatureHandler = async options => baseHandler(dashboardDriftFeatureHelper, options);

const yearMonthDropdownHelper = async() => {
    let yearDropdown = [];
    // let monthDropdown = [];
    const noOfYear = _get(CONSTANTS, 'noOfDropdownYear');
    let presentyear = new Date().getFullYear();
    for (let i = 0; i < noOfYear; i++) {
        yearDropdown.push({ value: presentyear, displayText: presentyear });

        presentyear = presentyear - 1;
    };

    const monthDropdown = _map(_get(CONSTANTS, 'months'), (m, index) => {
        return { value: index + 1, displayText: m };
    });
    return { content: { yearDropdown, monthDropdown } };
}

const yearMonthDropdownHandler = async options => baseHandler(yearMonthDropdownHelper, options);
module.exports = {
    dashboardHandler,
    dataSceinceDropdownHandler,
    dashboardProphetHandler,
    businessUserDropdownHandler,
    dashboardFilterHandler,
    distributionDropdownHandler,
    skuDropdownHandler,
    dashboardDriftFeatureHandler,
    yearMonthDropdownHandler,
};