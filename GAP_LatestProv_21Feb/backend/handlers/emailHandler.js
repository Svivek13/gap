const { baseHandler } = require('../private/base-handler');
const sendEmail = require('../nodeMailer/sendEmail');
const {get: _get, isEmpty: _isEmpty } = require('lodash');
const { cleanEntityData, getEmailTemplatesLogo } = require('../helpers/commonUtils');
const { env } = require('../config/env');

const  compileMjml = require('../mjmlFormatter/handlebarCompiler');
const convertMjmlToHtml = require( '../mjmlFormatter/mjml2html');
const util = require('util');
const fs = require('fs');

const { userFindOne } = require('../models/user');
const { CONSTANTS } = require('../helpers/constant');

const rootPath = appRoot;


const promisifiedReadFile = util.promisify(fs.readFile);


// import { promisifiedReadFile, mapFilePath, mapEmailOptions } from '../../helpers/commonUtil';




const formatingEmailTemplate = async ({ data }) => {
    const filePath = _get(data, 'filePath');
    // console.log('filePath', filePath);
    const fileData = await promisifiedReadFile(filePath, 'utf8');
    const compiledMjmlTemplate = await compileMjml({ templateData: fileData.toString() });
    const mappedData = _get(data, 'templateData');
    const mjmlContent = compiledMjmlTemplate({  ...mappedData });
    const compiledHtmlContent = await convertMjmlToHtml({ content: mjmlContent });
    return compiledHtmlContent;
    // const subject = _get(data, 'subject');
    // const mailOptions = mapEmailOptions({ html: compiledHtmlContent, to: _get(data, 'email'), subject, attachDataUrls: true, text: _get(data, 'text'),  });
    // return sendEmail({ mailOptions });
}


const emailSender = async({ to, subject, html, attachDataUrls, text, attachments }) => {
    const emailpayload = cleanEntityData({
        from:`ML Works Team <${_get(env, 'emailFrom')}>`,
        to,
        subject,
        html,
        text,
        // text: "working",
        // html: '<h1>Welcome</h1><p>That was easy!</p>',
        attachDataUrls,
        attachments,
    });
    sendEmail({ mailOptions: emailpayload });
};


const notificationType = {
    "jobCompletion": async ({ data, userData }) => {
        const emailData = cleanEntityData({
            templateData: cleanEntityData({
                    firstName: _get(userData, 'name'),
                    jobId: _get(data, 'jobId'),
                    jobType: _get(data, 'jobType'),
                    status: _get(data, 'status'),
                    startTime: _get(data, 'startTime'),
                    runTime: _get(data, 'runTime'),
                    statusDescription: _get(CONSTANTS, `templateWords.JobCompletion.${_get(data, 'status')}`),
                    errorMessage: _get(data, 'errorMessage')
                }),
            to: _get(data, 'recipientEmail'),
            subject: _get(CONSTANTS, 'templateEmailSubjects.JobCompletion'),
            filePath: `${rootPath}${_get(CONSTANTS, 'relativePathOfTemplate.execution')}/${_isEmpty(_get(data, 'errorMessage')) ? 'jobCompletion.mjml': 'jobCompletionFailed.mjml'}`,
        });
        return emailData;
    
        
    }
}

const emailSendHelper = async ({ body }) => {
    // emailSender({
    //     to: _get(body, 'recipientEmail'),
    //     subject: _get(body, 'subject'),
    //     html: _get(body, 'html'),
    //     text: _get(body, 'text'),
    //     attachDataUrls: true,
    // });

    const r = notificationType[`${_get(body, 'notificationType')}`];
    const userData = await userFindOne({ _id: _get(body, 'userId') });
    
    const emailData = await r({ data: body, userData });
    
    await formatAndSendEmail({ data: emailData });
    return { content: { message: "Email is sent successfully"}}
}
const emailSendHandler = async options => baseHandler(emailSendHelper, options);

const logoAttachments = {
    normal: [
        {
            filename: 'ml-works-logo-orange.png',
            path: `${appRoot}/src/assets/img/ml-works-logo-orange.png`,
            cid: 'mlworks@logo' //same cid value as in the html img src
        },
        {
            filename: 'tredence_logo.png',
            path: `${appRoot}/src/assets/img/logo_low.png`,
            cid: 'tredence@logo' //same cid value as in the html img src
        }
    
    ],
    welcome: [
        {
            filename: 'tredence_logo.png',
            path: `${appRoot}/src/assets/img/logo_low.png`,
            cid: 'tredence@logo' //same cid value as in the html img src
        }
    ]

};


const formatAndSendEmail = async ({ data }) => {
    // const emailLogo = getEmailTemplatesLogo();
    const finalData = {
        ...data,
        // mlworksLogo: _get(emailLogo, 'mlworks')
    };

    // console.log('final data', finalData);
    const emailTemplate = await formatingEmailTemplate({ data: finalData });
    // console.log(emailTemplate);
    let logoAttach = logoAttachments['normal']
    if (_get(data, 'type') === 'welcome') {
        logoAttach = logoAttachments[`${_get(data, 'type')}`];
    }

    // console.log('attachments', logoAttach);

    
    emailSender({
        to: _get(data, 'to'),
        subject: _get(data, 'subject'),
        html: emailTemplate,
        text: _get(data, 'text'),
        attachDataUrls: true,
        // attachments: [
        //    ..._get(data, 'attachments', []),
        //    ...logoAttach
        // ]
    });
    return emailTemplate;
}

module.exports = {
    emailSendHandler,
    formatAndSendEmail,
}