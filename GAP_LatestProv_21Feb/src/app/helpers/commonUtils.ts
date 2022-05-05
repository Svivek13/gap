import * as  moment  from 'moment';
import { get as _get, reduce as _reduce } from 'lodash';
import cleanDeep from 'clean-deep';



const dateTimeConversion = ({ dateTime }) => moment(dateTime).format('MM-DD-YYYY HH:mm:ss');

const enrichArrDataToObj = ({ data, field = '' }) => _reduce(data, (acc, val) => ({ ...acc, [_get(val, field)]: val }), {});

const cleanEntityData = (data) => {
    let cleanData = {};
    try {
        cleanData = cleanDeep(data);
    } catch (e) {
        // log error
    }
    return cleanData;
};





export {
    dateTimeConversion,
    enrichArrDataToObj,
    cleanEntityData,
}