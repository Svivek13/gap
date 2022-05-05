const azureStorage = require('azure-storage');
const getStream = require('into-stream')
const { get: _get } = require('lodash');
const fs = require('fs');
const { env } = require('../config/env');

const connectionString = _get(env, 'storage.connectionString');
const storageAccessKey = "LFjXc/TwA7ZLM/EMmsuWBCWeNgoHBrSWZNbwdnNtIQD9IaIHJd/+ENFplj404JXF97MUJCwHmazlhqQbwg73Eg==";
 
const blobService = azureStorage.createBlobService(connectionString);
const containerName = _get(env, 'storage.containerName');
const hostName = 'https://mogkctpe.blob.core.windows.net';

const saveAzure = ({file, user}) => new Promise((resolve, reject) => {
    const presentTimeStamp = new Date().getTime();
    const extractedFileNameArray = _get(file, 'originalname').split('.');
    const extractedFileName = extractedFileNameArray.slice(0, -1).join('.');
    const fileExtension = extractedFileNameArray.pop();
    const newFileName = `${extractedFileName}_${presentTimeStamp}.${fileExtension}`;

    const uniqueUserFolderName = _get(user, 'name', 'noname') + ' - ' + _get(user, '_id')

    const fileName =  'input-files' + '/' + uniqueUserFolderName + '/' + newFileName;
    const buffer = fs.readFileSync(file.path);
    const stream = getStream(buffer)
    const streamLength = buffer.length;
    
    // const stream = fs.createReadStream(file.path, { encoding: 'utf8' });
    // const streamLength = streamLength(stream);
    
    // two approaches: buffer and stream
    // createBlockBlobFromFile: check this later, reference below
    // https://willi.am/blog/2014/07/02/azure-blob-storage-and-node-creating-blobs/
    blobService.createBlockBlobFromStream(containerName, fileName, stream, streamLength, err => {
        if(err) {
            console.log('error while upload to azure: ', err);
            return reject(err);
            // throw err;
            // res.status(500).json({
            //     status: 'Upload to Azure container failed'
            // });
            
        }
        // file url sample
        // https://mogkctpe.blob.core.windows.net/mlworks-lite/input-files/Aishwarya/faithful_1611209454530.csv
        // url if required, can be fetched like this 
        // const url = blobService.getUrl(containerName, fileName, null, hostName);
        // console.log('insdie createBlock file: ', file);
        // console.log('err is: ', err)
        
        return resolve({
            [file.fieldname]: fileName
        });
    });   
}) 
module.exports = {
    saveAzure
}
