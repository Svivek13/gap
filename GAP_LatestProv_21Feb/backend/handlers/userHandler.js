const { isEmpty: _isEmpty, get: _get, set: _set } = require('lodash');
const { baseHandler } = require('../private/base-handler');
const { userFindOne, userFind, saveUser, updateUser } = require('../models/user');
const { userFindQuery, saveUserData } = require('../queryBuilder/user');
const { mapReqData, mapSignupReq, mapVerficationReqData, mapResetPassword } = require('../mappers/user');
const errorMessages = require('../private/error-message-codes');
const { env } = require('../config/env');

const bcrypt = require('bcryptjs');
const randomstring = require("randomstring");

const CustomError = require('../private/custom-error');
const sendEmail = require('../nodeMailer/sendEmail');

const { emailSendHandler, formatAndSendEmail } = require('../handlers/emailHandler');
const { cleanEntityData } = require('../helpers/commonUtils');

const jwt = require('jsonwebtoken');
const { CONSTANTS } = require('../helpers/constant');
const { postInvitation } = require('../models/invitation');

const rootPath = appRoot;

const authenticateUser = (user, rawPassword) => {
    let err;
    return new Promise(((resolve, reject) => {
        bcrypt.compare(rawPassword, _get(user, 'password'), (error, result) => {
            if (error) {
                console.log(error);
                err = {
                    statusCode: 404,
                    message: 'Invalid Credential',
                };
                reject(err);
            } else {
                resolve(result);
            }
        });
    }));
};

const signJWT = ({
    userDetail,
    // companyIds,
    // type,
    // profile,
    // accessLevel,
    // finalOrgs,
}) => new Promise((resolve, reject) => {
    const prvKey = _get(CONSTANTS, 'security.privateKey');
    jwt.sign({
            userId: _get(userDetail, 'id'),
            // email: _get(userDetail, '[0].email'),
            // userName: `${_get(userDetail, '[0].firstName')} ${_get(userDetail, '[0].lastName')}`,
            // companyIds,
            // userCompanyId: _get(userDetail, '[0].companyId.id'),
            // companyType: type,
            // roleId: _get(userDetail, '[0].roleId'),
            // profile,
            // dataAccessLevel: accessLevel,
            // userOrgId: _get(userDetail, '[0].organizationId', []),
            // orgIds: finalOrgs,
        },
        prvKey, { algorithm: 'RS256', expiresIn: _get(CONSTANTS, 'security.tokenExpiryTime') },
        (error, token) => {
            if (error) {
                reject(error);
            }
            resolve(token);
        },
    );
});

const userAuthHelper = async({ body }) => {
    const reqData = mapReqData({ data: body });
    const query = userFindQuery({ data: reqData });
    const user = await userFindOne(query);
    if (_isEmpty(user)) {
        const err = new CustomError(404, _get(errorMessages, 'userNotFound'));
        throw err;
    } else if (!_get(user, 'isVerified')) {
        const err = new CustomError(404, 'Email not Verified');
        throw err;
    }

    const checkPassword = await authenticateUser(user, _get(reqData, 'password'));
    if (!checkPassword) {
        const err = new CustomError(404, 'Invalid Credential');
        throw err;
    }

    const jwtToken = await signJWT({ userDetail: user });
    const userRes = cleanEntityData({
        id: _get(user, '_id'),
        name: _get(user, 'name', 'User')
    });
    return { content: {...userRes, jwtToken } };

};

const generateEncryptedPassword = ({ data }) => new Promise(((resolve, reject) => {
    bcrypt.hash(data, 8, (err, hash) => {
        if (err) {
            reject(err);
        } else {
            // _set(data, 'password', hash);
            resolve(hash);
        }
    });
}));

const emailSender = async({ to, subject, html, attachDataUrls, templateData }) => {
    const emailpayload = cleanEntityData({
        from: `mlops-lite <${_get(env, 'emailFrom')}>`,
        to,
        subject,
        html,
        // text: "working",
        // html: '<h1>Welcome</h1><p>That was easy!</p>',
        attachDataUrls,
    });
    sendEmail({ mailOptions: emailpayload });

};

const useSignupHelper = async({ body, protocol, origin, url }) => {

    const reqData = mapSignupReq({ data: body });

    const findUser = await userFindOne({ email: _get(reqData, 'email') });
    if (!_isEmpty(findUser)) {
        const err = new CustomError(400, _get(errorMessages, 'userAlreadyExist'));
        throw err;
    };
    const generatedRandomString = randomstring.generate();
    // proper jwt token generation logic
    const token = generatedRandomString;
    const password = await generateEncryptedPassword({ data: _get(reqData, 'password') });
    _set(reqData, 'token', token);
    _set(reqData, 'password', password);

    const finalData = saveUserData({ data: reqData });
    const response = await saveUser({ data: finalData });


    // emailSender({
    //     to: _get(reqData, 'email'),
    //     subject: 'Verify Email',
    //     html: `<div><a href="${origin}/#/sign-up?token=${generatedRandomString}" target="_blank">checking</a></div>`,
    //     attachDataUrls: true,
    // });

    const emailData = cleanEntityData({
        templateData: cleanEntityData({
            firstName: _get(response, 'name'),
            verificationLink: `${origin}#/login?token=${generatedRandomString}`
        }),
        to: _get(reqData, 'email'),
        subject: _get(CONSTANTS, 'templateEmailSubjects.confirmation'),
        filePath: `${rootPath}${_get(CONSTANTS, 'relativePathOfTemplate.user')}/signup.mjml`,
    });

    await formatAndSendEmail({ data: emailData });

    return { content: { id: _get(response, '_id'), message: "Email sent for verification to the registered email id" } };


}

const useSignupHandler = async options => baseHandler(useSignupHelper, options);


const userVerificationHelper = async({ data, origin }) => {
    const reqData = mapVerficationReqData({ data });
    const userData = await userFindOne({ token: _get(reqData, 'token') });

    if (_isEmpty(userData)) {

        // const err = new CustomError(404, 'Invalid Token');
        const err = {
            message: {
                msg: 'Invalid Token',
                
            },
            
            statusCode: 404
        }
        throw err;
    };

    const tokenTime = _get(userData, 'tokenGeneratedTime').getTime();
    const expiryTime = tokenTime + 1440 * 60000; // 24 hours expiry 
    const presentTime = new Date().getTime();

    if (presentTime >= expiryTime) {
        // const err = new CustomError(404, 'Token Expired');
        // console.log(err);
        
        const err1 = {
            message: {
                msg: 'Token Expired',
                email: _get(userData, 'email'),
            },
            
            statusCode: 404
        }
        throw err1;
    };

    const updateQuery = cleanEntityData({
        _id: _get(userData, '_id')
    });
    const updatedUser = await updateUser({ query: updateQuery, data: { isVerified: true } });
    // const finalUserData = await userFindOne({ _id: _get(userData, '_id')});


    const emailData = cleanEntityData({
        templateData: cleanEntityData({
                firstName: _get(userData, 'name'),
                loginLink:`${origin}#/login`,
                tredenceLink: "https://www.tredence.com/",
            }),
        to: _get(userData, 'email'),
        type: 'welcome',
        subject: _get(CONSTANTS, 'templateEmailSubjects.userSignUp'),
        filePath: `${rootPath}${_get(CONSTANTS, 'relativePathOfTemplate.user')}/welcome.mjml`,
        // attachments: [
        //     {
        //         filename: 'thankyou-signup.png',
        //         path: `${appRoot}/src/assets/img/thankyou-signup.png`,
        //         cid: 'thankyousignup@logo' //same cid value as in the html img src
        //     }
        // ]
    });

    await formatAndSendEmail({ data: emailData });
    return { content: { message: 'User is successfully verified' } };


}
const userVerificationHandler = async options => baseHandler(userVerificationHelper, options);


const resendEmailLinkHelper = async({ data, protocol, url, origin }) => {
    const email = _get(data, 'email');
    const userData = await userFindOne({ email });
    if (_isEmpty(userData)) {

        const err = new CustomError(404, 'Invalid Email');
        throw err;
    };
    const query = { email: _get(data, 'email') };
    // proper jwt token generation logic
    const generatedRandomString = randomstring.generate();
    const updatedUser = await updateUser({ query, data: { token: generatedRandomString, tokenGeneratedTime: new Date() } });
    const userResponse = await userFindOne({ _id: _get(userData, '_id') });
    // const emailpayload = cleanEntityData({
    //     // from: 'prabhanshuspro@gmail.com',
    //     to: _get(userData, 'email'),
    //     subject: 'Verify Email',
    //     html: `<div><a href="http://localhost:3000/verify?token=${generatedRandomString}" target="_blank">checking</a></div>`,
    //     // text: "working",
    //     // html: '<h1>Welcome</h1><p>That was easy!</p>',
    //     attachDataUrls: true,
    // });
    // sendEmail({ mailOptions: emailpayload });

    // emailSender({
    //     to: _get(userData, 'email'),
    //     subject: 'Verify Email',
    //     html: `<div><a href="${origin}/#/sign-up?token=${generatedRandomString}" target="_blank">checking</a></div>`,
    //     attachDataUrls: true,
    // })

    const emailData = cleanEntityData({
        templateData: cleanEntityData({
            firstName: _get(userResponse, 'name'),
            verificationLink: `${origin}#/login?token=${generatedRandomString}`
        }),
        to: _get(data, 'email'),
        subject: _get(CONSTANTS, 'templateEmailSubjects.confirmation'),
        filePath: `${rootPath}${_get(CONSTANTS, 'relativePathOfTemplate.user')}/signup.mjml`,
    });

    await formatAndSendEmail({ data: emailData });
    return { content: { id: _get(userResponse, '_id'), message: 'Email sent for verification to the registered email id' } };

}
const resendEmailLinkHandler = async options => baseHandler(resendEmailLinkHelper, options);

const userAuthHandler = async options => baseHandler(userAuthHelper, options);

const resetPasswordHelper = async({ body, origin }) => {
    const tokenQuery = { resetToken: _get(body, 'resetToken') };

    const userData = await userFindOne(tokenQuery);
    if (_isEmpty(userData)) {

        const err = new CustomError(404, _get(errorMessages, 'userNotFound'));
        throw err;
    };

    const tokenTime = _get(userData, 'resetTokenGeneratedTime').getTime();
    const expiryTime = tokenTime + 1440 * 60000;
    const presentTime = new Date().getTime();

    if (presentTime >= expiryTime) {
        const err = new CustomError(404, 'Token Expired');
        throw err;
    };

    const password = await generateEncryptedPassword({ data: _get(body, 'password') });
    const resetPasswordMapped = mapResetPassword({ data: body, password });
    const resetPasswordQuery = { email: _get(userData, 'email') };
    await updateUser({ query: resetPasswordQuery, data: resetPasswordMapped });

    const emailData = cleanEntityData({
        templateData: cleanEntityData({
            firstName: _get(userData, 'name'),
            loginLink: `${origin}#/login`
        }),
        to: _get(userData, 'email'),
        subject: _get(CONSTANTS, 'templateEmailSubjects.resetPasswordConfirmation'),
        filePath: `${rootPath}${_get(CONSTANTS, 'relativePathOfTemplate.user')}/resetPasswordConfirmation.mjml`,
    });
    await formatAndSendEmail({ data: emailData });

    return { content: { message: 'Password updated successfully' } };


};


const resetPasswordHandler = async options => baseHandler(resetPasswordHelper, options);

const emailValidator = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

const resetPasswordRequestHelper = async({ body, protocol, origin, url }) => {

    const email = _get(body, 'email');
    const validated = emailValidator(email);
    // console.log('validated emali: ', validated);
    if (!validated) {
        const err = new CustomError(404, _get(errorMessages, 'invalid email address'));
        throw err;
    }
    // console.log('reched here or not? ')
    const userData = await userFindOne({ email });
    if (_isEmpty(userData)) {

        const err = new CustomError(404, _get(errorMessages, 'userNotFound'));
        throw err;
    };
    const query = { email: _get(body, 'email') };
    const generatedRandomString = randomstring.generate();
    const updatedUser = await updateUser({ query, data: { resetToken: generatedRandomString, resetTokenGeneratedTime: new Date() } });
    const userResponse = await userFindOne({ _id: _get(userData, '_id') });
    // const emailpayload = cleanEntityData({
    //     // from: 'prabhanshuspro@gmail.com',
    //     to: _get(userData, 'email'),
    //     subject: 'Verify Email',
    //     html: `<div><a href="http://localhost:3000/verify?token=${generatedRandomString}" target="_blank">checking</a></div>`,
    //     // text: "working",
    //     // html: '<h1>Welcome</h1><p>That was easy!</p>',
    //     attachDataUrls: true,
    // });
    // sendEmail({ mailOptions: emailpayload });

    // emailSender({
    //     // from: 'prabhanshuspro@gmail.com',
    //     to: _get(userData, 'email'),
    //     subject: 'Verify Email',
    //     html: `<div><a href="${origin}/forgot/password/verify?token=${generatedRandomString}" target="_blank">checking</a></div>`,
    //     // text: "working",
    //     // html: '<h1>Welcome</h1><p>That was easy!</p>',
    //     attachDataUrls: true,
    // });


    const emailData = cleanEntityData({
        templateData: cleanEntityData({
            firstName: _get(userData, 'name'),
            resetPasswordLink: `${origin}#/forgot-password?token=${generatedRandomString}`
        }),
        to: _get(userData, 'email'),
        subject: _get(CONSTANTS, 'templateEmailSubjects.resetPassword'),
        filePath: `${rootPath}${_get(CONSTANTS, 'relativePathOfTemplate.user')}/resetPassword.mjml`,
    });
    await formatAndSendEmail({ data: emailData });

    return { content: { message: 'Email sent for verification to the registered email id' } };
}
const resetPasswordRequestHandler = async options => baseHandler(resetPasswordRequestHelper, options);

const userInviteHelper = async({ body, userId, origin }) => {
    const userDetail = await userFindOne({ _id: userId });
    // const emailBody = cleanEntityData({
    //     recipientEmail: _get(body, 'email'),
    //     subject: "App Invitation",
    //     html: `<div style="border: 5px; background-color: red; width: 30px; color: white; padding: '15px 32px'; text-align: center; display: inline-block; font-size: 16px"><a href=${origin}/signup>Register Now</a></div>`

    // });
    // const emailSent = await emailSendHandler({ body: emailBody });

    const invitationData = cleanEntityData({
        sender: _get(userDetail, '_id'),
        receiver: [_get(body, 'email')],
        createdBy: userId,
    });
    await postInvitation({ data: invitationData });

    const emailData = cleanEntityData({
        templateData: cleanEntityData({
            inviterName: _get(userDetail, 'name'),
            signUpLink: `${origin}#/sign-up`
        }),
        to: _get(body, 'email'),
        subject: _get(CONSTANTS, 'templateEmailSubjects.invitation'),
        filePath: `${rootPath}${_get(CONSTANTS, 'relativePathOfTemplate.user')}/invitation.mjml`,
    });

    const emailSent = await formatAndSendEmail({ data: emailData });
    const response = {
        message: "Email sent successfully"
    }
    return { content: response };
}

const userInviteHandler = async options => baseHandler(userInviteHelper, options);

module.exports = {
    useSignupHandler,
    userVerificationHandler,
    resendEmailLinkHandler,
    userAuthHandler,
    resetPasswordHandler,
    resetPasswordRequestHandler,
    userInviteHandler,
}

// module.exports = {
//     userAuthHandler
// }