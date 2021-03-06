const moment = require('moment');
const momentTimeZone = require('moment-timezone');

const getOffset = () => moment().format('Z');

const guessTimeZone = () => momentTimeZone.tz.guess();

const formatDate = (inputDate = false) => {
    const date = inputDate ? moment(inputDate) : moment();
    return date.isValid() ? date.format('MM-DD-YYYY') : false;
};

const formatDateTime = (inputDateTime = false) => {
    const dateTime = inputDateTime ? moment(inputDateTime) : moment();
    return dateTime.isValid() ? dateTime.format('MM-DD-YYYY h:mm:ss:SSS') : false;
};

const formatExpectedPhase = (inputDateTime = false, actionDate) => {
    const dateTime = inputDateTime ? moment(new Date(actionDate)).add(inputDateTime, 'days') : moment();
    return dateTime.isValid() ? dateTime.format('MM-DD-YYYY h:mm:ss:SSS') : false;
};

module.exports = {
    getOffset,
    guessTimeZone,
    formatDate,
    formatDateTime,
    formatExpectedPhase,
};

