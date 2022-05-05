// const { transporter } = require('./createConnection');
// const { transporter } = require('../../server');

const { Configuration } = require('tslint');
const { createEmailServerTransport } = require('../nodeMailer/createConnection');
const nodeMailer = require('nodemailer');
const { env } = require('../config/env');
const { get: _get } = require('lodash');

async function sendEmail({ mailOptions }) {
    // console.log(mailOptions, JSON.stringify(transporter));
    // console.log(env, '============env============');


    try {

        // creating connection for email

        // const nodemailerConfigGenerator = () => ({
        //     service: 'gmail',
        //     // host: appSettings.gmailService.host,
        //     tls: true,
        //     auth: {
        //         user: 'mlworkslite@gmail.com',
        //         pass: 'Tredence@123',
        //     },
        // });

        // gmail configuration working

        // const configurations = {
        //     service: 'gmail',
        //     // host: 'smtp.gmail.com',
        //     // port: 465,
        //     // secure: true,
        //     tls: true,
        //     auth: {
        //         user: _get(env, 'gmailSender.username'),
        //         pass: _get(env, 'gmailSender.password'),
        //     },
        // };


        // outlook configuration

        // get outlook sender email password from the window env file.

        const configurations = {
            // name: "smtp.office365.com",
            host: "smtp.office365.com",
            port: 587,
            secureConnection: false,
            // tls: {
            //     ciphers:'SSLv3'
            // },
            auth: {
                user: _get(env, 'outlookSender.username'),
                // pass: _get(env, 'outlookSender.password')
                pass: process.env['OUTLOOKEMAILSENDERPASSWORD']
            }
        }
        // console.log(configurations);

        // console.log(configurations, mailOptions);
        let transporter = nodeMailer.createTransport({...configurations });
        const response = await transporter.sendMail(mailOptions);
        // console.log(response);
        return response;
    } catch (err) {
        console.log('email error', err);
        // console.log('checking');
        return err;
    }
}

module.exports = sendEmail;