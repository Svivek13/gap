var express = require('express');
var app = express();
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // env setup using dotenv
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors');
const { env, updateEnv, envInitializations } = require('./backend/config/env');
const compression = require('compression');
const { connectMongo } = require('./backend/private/mongoose-connect');
const { get: _get, isEmpty: _isEmpty } = require('lodash');
const { createEmailServerTransport } = require('./backend/nodeMailer/createConnection');
const { enableAuthentication } = require('./backend/private/authentication');



const { SecretClient } = require("@azure/keyvault-secrets");
const { ClientSecretCredential } = require("@azure/identity");


// root path initialization

global.appRoot = path.resolve(__dirname);


// env intialization

envInitializations();


// logging
const packageFile = require('./package.json');
const loggerWrapper = require('aob-logger-wrapper');
const dateUtil = require('./backend/private/date-util');
const logFilePath = path.resolve('logs/application.log');
const { v4: uuidv4 } = require('uuid');
const expressInterceptor = require('express-interceptor');
const _ = require('lodash');
const MESSAGE_CODES = require('./backend/private/log-message-codes');
const { CONSTANTS } = require('./backend/helpers/constant');
// import expressInterceptor from 'express-interceptor';
// createLogger, logInfo, logError, setLoggerLevel, getLoggerLevel
// For logging the incoming request - entry point logging
const requestInterceptor = (req, res, next) => {
    // log with correlation id here and if no correlation id then generate uuid here
    const reqId = _.get(req, 'headers.correlationid', false) || uuidv4();
    req.reqId = reqId;
    res.reqId = reqId;
    req.startTime = new Date();
    loggerWrapper.logInfo({
        code: MESSAGE_CODES.appRequestCode,
        message: 'Request Received',
        req,
        correlationId: req.reqId,
        deviceInfo: true,
    });
    return next();
};


function logReqRes(req, res, next) {
    // const incomingUrl = req.url || req.href || req.uri;
    if (_.get(env, 'exemptedRoutes').includes(req.url || req.originalUrl)) {
        return next();
    }
    const oldWrite = res.write;
    const oldEnd = res.end;

    const chunks = [];

    res.write = (...restArgs) => {
        chunks.push(Buffer.from(restArgs[0]));
        oldWrite.apply(res, restArgs);
    };

    res.end = (...restArgs) => {
        if (restArgs[0]) {
            chunks.push(Buffer.from(restArgs[0]));
        }
        const body = Buffer.concat(chunks).toString('utf8');
        const response = _.cloneDeep(res);
        response.body = body;
        loggerWrapper.logInfo({
            code: MESSAGE_CODES.appResponseCode,
            message: 'Response Sent',
            req,
            res: response,
        });

        // console.log(body);
        oldEnd.apply(res, restArgs);
    };

    next();
}



const loggerWrapperChecking = loggerWrapper.createLogger({
    appName: packageFile.name,
    logLevel: 'info',
    logStreams: [{
        type: 'rotating-file',
        path: logFilePath,
        period: '1d', // daily rotation
        count: 3, // keep 120 back copies
    }],
    logSrc: false,
    offset: dateUtil.getOffset(),
    timezone: dateUtil.guessTimeZone(),
    componentName: packageFile.name,
    appVersion: packageFile.version,
});
app.use(requestInterceptor);
// app.use(expressInterceptor(responseInterceptor));
// app.use(logResponseBody);
app.use(logReqRes);
// end logging

//for handeling CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    allowedHeaders: 'X-Requested-With,content-type,Authorization',
    credentials: true
};


// crome Access-Control-Allow-Headers

app.use(cors(corsOptions));
app.options('*', cors());





// Point static path to public
app.use(express.static(path.join(__dirname, 'public')));

// compression the output
app.use(compression());

// checking jwt
const serviceBasePath = 'http://localhost:5000';
enableAuthentication(app, CONSTANTS.routes.exemptedRoutes, serviceBasePath, CONSTANTS.security.publicKey);



require('./backend/routes/checkRoutes.js')(app);
require('./backend/routes/pipelineRunRoutes.js')(app);
require('./backend/routes/activityRunRoutes.js')(app);
require('./backend/routes/pipelineRoutes.js')(app);
require('./backend/routes/userRoutes.js')(app);
require('./backend/routes/dashboardRoutes.js')(app);
require('./backend/routes/projectRoutes.js')(app);
require('./backend/routes/driftRoutes')(app);
require('./backend/routes/email')(app);
require('./backend/routes/xaiRoutes')(app);
require('./backend/routes/BUMetric')(app);
require('./backend/routes/DEMetric')(app);
require('./backend/routes/faq')(app);
require('./backend/routes/supportTicket')(app);
require('./backend/routes/trackingMetricsRoutes')(app);
require('./backend/routes/stratify')(app);
require('./backend/routes/document')(app);
require('./backend/routes/dataDriftGapRoute')(app);
require('./backend/routes/metaData')(app);
require('./backend/routes/xaiRoutesGap')(app);
require('./backend/routes/dqmCompletenessRoute')(app);
require('./backend/routes/dqmUniquenessRoutes')(app);
require('./backend/routes/cockpitRoutes')(app);
// mongodb credential

const dbProtocol = _get(env, 'dbConfigs.protocol');
const dbHost = _get(env, 'dbConfigs.host');
const dbPort = _get(env, 'dbConfigs.port');
const dbName = _get(env, 'dbConfigs.dbName');
const dbUsername = _get(env, 'dbConfigs.username');
// const dbPassword = _get(env, 'dbConfigs.password');

// const dbHost = process.env.DB_HOST;
// const dbPort = process.env.DB_PORT;
// const dbName = process.env.DB_NAME;
// const dbUsername = process.env.DB_USER;
// const dbPassword = process.env.DB_PASS;


const getVault = async(secretName) => {
    const tenantId = _get(env, 'keyVault.tenantId');
    const clientId = _get(env, 'keyVault.clientId');
    const clientSecret = _get(env, 'keyVault.clientSecret');
    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

    const vaultName = _get(env, 'keyVault.vaultName');
    const url = _get(env, 'keyVault.vaultUrl');

    const client = new SecretClient(url, credential);

    //const secretName = _get(env, 'keyVault.secretName');
    // const latestSecret = await client.getSecret(secretName);
    // return _get(latestSecret, 'value');
    // console.log(latestSecret);
    // const data = {
    //     outlookSenderPassword: _get(latestSecret, 'value'),
    // };
    // process.env['OUTLOOKEMAILSENDERPASSWORD'] = _get(data, 'outlookSenderPassword');
   
}

const setEnv = async ({ envKey, envValue}) => {
    // console.log(envKey, envValue);
    process.env[envKey] = envValue;
};



// Create a Server
var server = app.listen(_get(env, 'appPort', 3000), async function() {
    var host = server.address().address
    var port = server.address().port
   // const emailPassword = await getVault(_get(env, 'keyVault.secretName'));
    // console.log(emailPassword)
  // setEnv({ envKey: 'OUTLOOKEMAILSENDERPASSWORD', envValue: emailPassword });
  // const dbPassword = await getVault(_get(env, 'keyVault.dbSecretName'));
const dbPassword = "HrpOT4qwqCHwRHtUCAyXtIFxKqt4XB3LYD2aB89QEgMyHrX5vfMVSENoVrGgaaTRNgwJ6bLxChHnuyMRCB58Tw==";
    // console.log(env);

    global.__basedir = __dirname;

    console.log("App listening at http://%s:%s", host, port)

    // If pwd exsist then connect to Managed Monogo Service else local one.
    // eslint-disable-next-line no-unused-expressions


    let mongUrlPath;
    // (
    //     !_isEmpty(dbPassword) ? mongUrlPath = `${dbProtocol}://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`
    //       : mongUrlPath = `${dbProtocol}://${dbHost}:${dbPort}/${dbName}`
    // );

    (!_isEmpty(dbPassword) ? mongUrlPath = `${dbProtocol}://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?ssl=true` :
        mongUrlPath = `${dbProtocol}://${dbHost}:${dbPort}/${dbName}`
    );

    // mongUrlPath = 'mongodb://mlworks_admin_all_country_with_drift:mwork5admin123@mongoserver.eastus2.cloudapp.azure.com:27017/all_country_with_drift';
    // mongUrlPath = 'mongodb://kcmlworks:xsu8yYDVICZNhrcf9RpqVB6ckDSFP1NtjbW8D2LRllM7J9rbevG55bhxj3fI9G3Kk3amikX16i4ivqF49Bikzg==@kcmlworks.mongo.cosmos.azure.com:10255/trend_runs?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@kcmlworks@';

    connectMongo({ mongoUrl: mongUrlPath, newUrlParser: { useNewUrlParser: true, useUnifiedTopology: true } })
        .then(() => {
            console.log('Mongoose connected to ', mongUrlPath);
            loggerWrapper.logInfo({
                
                message: 'Database connected',
               
            });


        })
        .catch((err) => {
            console.log('connection string', mongUrlPath)
            console.error('mongo not connected', err);
            loggerWrapper.logInfo({
                message: 'Database not connected',
            });
            process.exit(1);
        });
})

module.exports = {
    server,
    getVault,
}
