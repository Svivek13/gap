const { createTransport }  = require('nodemailer');

let transporter;

async function createEmailServerTransport({ configs }) {
    transporter = createTransport({
        ...configs,
    });
    return transporter;
}

module.exports = {
    createEmailServerTransport,
    transporter,
};
