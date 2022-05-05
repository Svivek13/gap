const storage = require('azure-storage');
const fs = require('fs');
const { reject, get: _get } = require('lodash');


const { env } = require('../config/env');

// const connectionString = "DefaultEndpointsProtocol=https;AccountName=mogkctpe;AccountKey=LFjXc/TwA7ZLM/EMmsuWBCWeNgoHBrSWZNbwdnNtIQD9IaIHJd/+ENFplj404JXF97MUJCwHmazlhqQbwg73Eg==;EndpointSuffix=core.windows.net";
const connectionString = _get(env, 'storage.connectionString');
const blobService = storage.createBlobService(connectionString);
// const containerName = 'mlworks-lite';
const containerName = _get(env, 'storage.containerName');

exports.downloadFromAzure = ({blobName}) => new Promise((resolve, reject) => {
// const blobName = 'my-awesome-file-blob';
    // const fileName = 'hello-world.txt';
    const presentTimeStamp = new Date().getTime();
    const fileName = 'downloads/' + presentTimeStamp + '_' + blobName.split('/').join('_');
    console.log(fileName, '==================================', blobName);
    
    // blobService.getBlobToFile(
    //     containerName,
    //     blobName,
    //     fileName,
    //     function(err, blob) {
    //         if (err) {
    //             console.error("Couldn't download blob %s", blobName);
    //             console.error(err);
    //         } else {
    //             console.log("Sucessfully downloaded blob %s to %s", blobName, fileName);
    //             fs.readFile(fileName, function(err, fileContents) {
    //                 if (err) {
    //                     console.error("Couldn't read file %s", fileName);
    //                     console.error(err);
    //                 } else {
    //                     console.log(fileContents);
    //                     return fileContents;
    //                 }
    //             });
    //         }
    //     });
    // return reject({ err: 'error dummy'})
    blobService.getBlobToStream(containerName, blobName, fs.createWriteStream(fileName), function(error, result, response) {
        if (!error) {
          // blob retrieved
          // console.log(result)
          // console.log(response)

            return resolve(fileName)
            // return reject(fileName);
        } else {
          return reject(error);
        }
      });
});


exports.downloadAndStreamFileFromAzure = ({ res, filePath }) => {
  const fileName = filePath;
  blobService.getBlobProperties(
      containerName,
      fileName,
      function(err, properties, status) {
          // console.log(containerName, fileName, properties);
          if (err) {
              // console.log(err);
              res.send(502,  err.message);
          } else if (!status.isSuccessful) {
              res.send(404,  fileName);
          } else {
              res.header('Content-Type', _get(properties, 'contentSettings.contentType', 'application/pdf'));
              blobService.createReadStream(containerName, fileName).pipe(res);
          }
      });
}
    
