const { cleanEntityData } = require('../helpers/commonUtils');
const { get: _get } = require('lodash');

const userFindQuery = ({ data }) => cleanEntityData({
    email: _get(data, 'email')
});

const saveUserData = ({ data }) => cleanEntityData({
    email: _get(data, 'email'),
    company: _get(data, 'company'),
    designation: _get(data, 'designation'),
    name: _get(data, 'name'),
    password:  _get(data, 'password'),
    token: _get(data, 'token'),
    country: _get(data, 'country'),
    companyUrl: _get(data, 'companyUrl'),
    phoneNumber: _get(data, 'phoneNumber'),
    refBy: _get(data, 'refBy'),
});

module.exports = {
    userFindQuery,
    saveUserData,
}