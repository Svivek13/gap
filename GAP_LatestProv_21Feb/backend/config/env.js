const { get: _get } = require('lodash');
const config = require("config");

// const env = {
//     exemptedRoutes: ['/main.js', '/vendor.js', '/scripts.js', '/styles.js', 'polyfills.js', 'runtime.js'],
//     dbConfigs: {
//         protocol: 'mongodb',
//         // host: 'mongo-server.eastus2.cloudapp.azure.com',
//         // host: 'localhost',
//         host: 'mlw-lite.mongo.cosmos.azure.com',
//         // host: 'kcmlworks.mongo.cosmos.azure.com',
//         // port: 27017,
//         port: 10255,
//         // dbName: 'practice_db',
//         dbName: 'mlw-lite',
//         // dbName: 'test',
//         // username: 'mlworks_admin_all_country_with_drift',
//         // password: 'mwork5admin123'
//         // username: 'mlworks_admin',
//         // password: 'mwork5admin123',
//         username: 'mlw-lite',
//         password: 'z2XkUqu5HLhn4e0x8ULMkKfPJbHoPi6kll0tDxHrkGIsWqTcPrbMEslDpm2nRC2QnDxEPHRAKZn4nQp1nvC28w=='
//         // username: 'kcmlworks',
//         // password: 'xsu8yYDVICZNhrcf9RpqVB6ckDSFP1NtjbW8D2LRllM7J9rbevG55bhxj3fI9G3Kk3amikX16i4ivqF49Bikzg==',
//     },
//     gmailSender: {
//         username: 'mlworkslite@gmail.com',
//         password: 'Tredence@123'
//     },
//     outlookSender: {
//         username: 'mlworks@tredence.com',
//         password: ''
//     },
//     emailFrom: 'mlworks@tredence.com',
//     keyVault: {
//         tenantId: "927e65b8-7ad7-48db-a3c6-c42a67c100d6",
//         clientId: "f1cd39ba-bc5b-4665-9005-b39eaaa629cf",
//         clientSecret: "Trme1m3N_f1jWJ7Mb_SSgpzT65-o8Mg~CP",
//         vaultName: 'mlworksakv',
//         vaultUrl: 'https://mlworksakv.vault.azure.net/'
//     },

//     blob: () => {
//         return `${this.envType}-input-data`
//     }
// };

const env = {
        blob: () => {
        return `${this.envType}-input-data`
    }
}

updateEnv = ({ data, env }) => {
    env.outlookSender.password = _get(data, 'outlookSenderPassword');
    
}

const envInitializations = () => {
    env['envType'] = config.get('envType');
    env['exemptedRoutes'] = config.get('exemptedRoutes');
    env['dbConfigs'] = config.get('dbConfigs');
    env['gmailSender'] = config.get('gmailSender');
    env['outlookSender'] = config.get('outlookSender');
    env['emailFrom'] = config.get('emailFrom');
    env['keyVault'] = config.get('keyVault');
    env['dagUrl'] = config.get('dagUrl');
    env['baseUrl'] = config.get('baseUrl');
    env['storage'] = config.get('storage');
    env['appPort'] = config.get('appPort') || 3000;
    return true;
    
};
module.exports = {
    env,
    updateEnv,
    envInitializations,
}