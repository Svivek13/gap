const { cleanEntityData } = require('../helpers/commonUtils');
const { get: _get } = require('lodash');

const mapReqData = ({ data }) => cleanEntityData({
    // userName: Buffer.from(_get(data, 'userName'), 'base64').toString('utf-8'),
    email: _get(data, 'email'),
    password: _get(data, 'password')
});

const mapSignupReq = ({ data }) => cleanEntityData({
    email: _get(data, 'email'),
    company: _get(data, 'company'),
    designation: _get(data, 'designation'),
    name: _get(data, 'name'),
    password:  _get(data, 'password'),
    country: _get(data, 'country'),
    companyUrl: _get(data, 'companyUrl'),
    phoneNumber: _get(data, 'phoneNumber'),
    refBy: _get(data, 'refBy'),
});

const mapVerficationReqData = ({ data }) => cleanEntityData({
    token: _get(data, 'token')
});

const mapResetPassword = ({ data, password }) => cleanEntityData({
    password,
});


module.exports = {
    mapReqData,
    mapSignupReq,
    mapVerficationReqData,
    mapResetPassword,
};