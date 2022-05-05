const { get: _get, orderBy: _orderBy, map: _map, isEmpty: _isEmpty, reduce: _reduce, trim: _trim, max: _max, min: _min, min } = require('lodash');
const { findMonth, findMonthDate, cleanEntityData, removeDateFromMonth } = require('../helpers/commonUtils');
const moment = require('moment');

const mapDriftResponse = ({ data }) => {
    const latestDriftData = _get(data, '0');
    const ascOrderedDrift = _orderBy(data, ['datetime'], ['asc']);
    let driftTrend = [];
    let labels = [];

    const sixMonthPreviousDate = moment.parseZone(_get(latestDriftData, 'datetime').toISOString()).subtract(5, 'months').startOf('month');
    const latestDate = _get(latestDriftData, 'datetime');
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

    const mapData = _map(ascOrderedDrift, od => {
        let month = findMonthDate({ date: _get(od, 'datetime')})
        labels.push(month);
        driftTrend.push(_get(od, 'Overall_Drift', 0));
    });

    // adding months that doesnot has filed metrics
    _map(labels_check, (lc, index) => {
        const l1 = labels[index] ? labels[index].split('-')[1]: undefined;
        // console.log('l1', l1, labels, labels[index]);
        if (l1 && lc !== l1) {
            labels.splice(index, 0, `01-${lc}`);
            
            driftTrend.splice(index, 0, 'NaN');
            
        }
    });


    // removal of date from labels
    const finalLabels = !_isEmpty(labels) ? removeDateFromMonth({ data: labels }): [];
    // end of date removal
    const dataResponse = {
        latestData: latestDriftData,
        trendData: [
            { data: driftTrend, pointRadius: 3, tooltip: labels},

        ],
        labels: finalLabels
    };

    return dataResponse;
    
};


const mapDataDriftFeature = ({ filedMetricData, dataDriftMetricData, driftTrainData, driftTestData }) => {
    // console.log(JSON.stringify(filedMetricData));
    // console.log('check');
    // console.log(JSON.stringify(dataDriftMetricData ));

    const features = _get(filedMetricData, 'Method') === 0 ? _get(filedMetricData, 'Regressors_list') : _get(filedMetricData, 'Regressors_list1');
    // featuresArray =  features && features.slice(1, features.length - 1).split(',');
    // const featuresString = features && features.slice(1, features.length -1);
    // const featuresArray = JSON.parse("[" + featuresString + "]");
    // const formatFeatures = features && features.replace(/'/g, "");
    // const featuresArray = JSON.parse(formatFeatures);
    const featuresString =  features && features.slice(1, features.length - 1);
    const formatFeatures = featuresString && featuresString.replace(/'/g, "");
    let featuresArray = formatFeatures.split(",");
    featuresArray = _map(featuresArray, f => _trim(f));
    const featureData = _map(featuresArray, f => {
        const val = _get(dataDriftMetricData, f) ? _get(dataDriftMetricData, f): 0;
        return val;
    });

    const featureDetails = _reduce(featuresArray, (acc, val) => {
        
        const trainData = _reduce(driftTrainData, (acc1, dtrain) => {
            if (isFinite(_get(dtrain, val))) {
                acc1.push(_get(dtrain, val));
            }
            return acc1;
            // const data = _get(dtrain, val, 0)
            
            // return data;
        }, []);
        
        const testData = isFinite(_get(driftTestData, `0.${val}`)) ?  [_get(driftTestData, `0.${val}`)] : undefined;

        let range = [];
        let stepSize;
        if (!_isEmpty(trainData)){
            const maxTrainData = trainData && _max(trainData);
            const minTrainData = trainData && _min(trainData);
            const maxDataAfterCompare = maxTrainData > testData[0] ? maxTrainData : testData[0];
            const minDataAfterCompare = minTrainData > testData[0] ? testData[0] : minTrainData;
            

            
            const newMaxTrainData = maxDataAfterCompare && maxDataAfterCompare + (maxDataAfterCompare * 0.1);
            
            // console.log(newMaxTrainData, 'maxtrainData', maxTrainData, testData);
            const newMinTrainData =  minDataAfterCompare && minDataAfterCompare - (Math.abs(minDataAfterCompare) * 0.1);
            // console.log(newMinTrainData, 'mintrainData', minTrainData);
            
            // const diff = newMinTrainData && newMaxTrainData && newMaxTrainData - newMinTrainData;
            const diff = isFinite(newMinTrainData) && isFinite(newMaxTrainData) ? newMaxTrainData - newMinTrainData : undefined;
            stepSize =  diff && Math.floor(Math.abs(diff)/5);
            // console.log('stepsize', stepSize);
            const modifiedMinTrainData = isFinite(newMinTrainData) ? newMinTrainData - stepSize : undefined;
            // console.log(modifiedMinTrainData, 'min');
            const modifiedMaxTrainData = isFinite(newMaxTrainData) ? newMaxTrainData + stepSize : undefined;
            // console.log(modifiedMaxTrainData, 'max')
            range = [modifiedMinTrainData, modifiedMaxTrainData];

            acc.push({ feature: val, testData, trainData, range, stepSize });
        }
        
        return acc;
    }, []);

    const response = cleanEntityData({
        featureWiseDrift: cleanEntityData({
            labels: featuresArray,
            data: [
                {
                    data: featureData
                }
            ]
        }),
        featureDetails,
    });
    return response;
    
}

module.exports = {
    mapDriftResponse,
    mapDataDriftFeature
}