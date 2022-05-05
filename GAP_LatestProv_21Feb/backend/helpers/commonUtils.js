const moment = require('moment');
const _ = require('lodash');
const cleanDeep = require('clean-deep');

const joinUrl = require('url-join');



const makeUrl = (baseUrl, [...relativeUrl]) => {
    let relUrl;
    if (relativeUrl && relativeUrl.length) {
        relUrl = relativeUrl.join('/');
    }
    const url = baseUrl ? joinUrl(baseUrl, relUrl) : joinUrl(relUrl);
    return url;
};



const dateTimeConversion = ({ dateTime }) => moment(dateTime).format('MM-DD-YYYY HH:mm:ss');

const enrichArrDataToObj = ({ data, field = '' }) => _.reduce(data, (acc, val) => ({ ...acc, [_.get(val, field)]: val }), {});

const cleanEntityData = (data) => {
    let cleanData = {};
    try {
        cleanData = cleanDeep(data);
    } catch (e) {
        // log error
    }
    return cleanData;
};

const findMonth = ({ date }) => {
    return moment.parseZone(date).format("MMM");
};

const findMonthDate = ({ date }) => {
    // console.log(date, 'date');
    return moment.parseZone(date.toISOString()).format("DD-MMM")
}

const findMonthDateCheck = ({ date }) => {
    return moment.parseZone(date).format("DD-MMM")
};


const findYear = ({ date }) => {
    return moment.parseZone(date).format("YYYY");
}


const findMonthNumber = ({ date }) => {
    return moment.parseZone(date).format("M");
}

const findIndexForDuplicateRecord = ({ label_arr, present_index }) => {
    let index = present_index;
    console.log(present_index, 'check');
    console.log(label_arr[present_index], label_arr[present_index-1], 'label value');

    const l1 = label_arr[present_index] ? label_arr[present_index].split('-')[1] : 'l1';
    const l2 = label_arr[present_index - 1] ? label_arr[present_index - 1].split('-')[1] : 'l2';

    if(label_arr[present_index] === label_arr[present_index - 1]) {
        findIndexForDuplicateRecord({ label_arr, present_index: index + 1 });
    } else if (l1 === l2){
        findIndexForDuplicateRecord({ label_arr, present_index: index + 1 });
        
        // if (l1 === l2 ) {
        //     findIndexForDuplicateRecord({ label_arr, present_index: present_index + 1 });
        // } else {
        //     // console.log('present_index', present_index);
        //     return present_index;
        // }
        
        // return present_index;
    } else {
        return index;
    }
};


// let present_index = 0;
//     _map(labels_check, (lc, index) => {
//         console.log(labels, present_index);
//         present_index_found = findIndexForDuplicateRecord({ label_arr: labels, present_index });
//         console.log('present_index_found', present_index_found);
//         present_index = present_index_found;

//         const l1 = labels[present_index] ? labels[present_index].split('-')[1] : undefined;
//         // console.log('l1', l1, labels, lc);

//         if (l1 && lc !== l1) {
//             labels.splice(present_index, 0, `01-${lc}`);
//             console.log(labels, 'chaku');
//             rmseData.splice(present_index, 0, 0);
//             mapeData.splice(present_index, 0, 0);
//             present_index += 1;
//         } else {
//             present_index += 1;
//         }
//     });

const removeDateFromMonth = ({ data }) => {
    const modifiedData = _.map(data, d => {
        const splitDate = d.split('-')[1];
        return splitDate;
    });
    return modifiedData;
}

const msToTime = (duration) => {
    if(isNaN(duration) || duration < 0) {
        return "NA"
    }
    let milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    // return hours + "h " + minutes + "min " + seconds + "." + milliseconds + 's';
    return hours + "h " + minutes + "min " + seconds + 's';
  }


  const getEmailTemplatesLogo = () => {
      return {
        mlworks: `${appRoot}/src/assets/img/ml-works-logo-orange.png`,
      }
      

  };




module.exports = {
    dateTimeConversion,
    enrichArrDataToObj,
    cleanEntityData,
    findMonth,
    findMonthDate,
    findMonthDateCheck,
    findYear,
    findMonthNumber,
    findIndexForDuplicateRecord,
    removeDateFromMonth,
    makeUrl,
    msToTime,
    getEmailTemplatesLogo
}