const multer = require('multer');
const fileUploadController = require('../private/single-file-upload');
const multiFilesUploadController = require('../private/multi-files-upload');
const { get: _get } = require('lodash');
const ProjectHandler = require('../handlers/projectHandler');
const baseCtrl = require('../private/base-controller');


let includedFileType = ['text/csv', 'application/json', 'application/vnd.ms-excel'];
let includedFileTypeForModel = ['application/octet-stream'];

module.exports = function(app) {
    app.post('/api/project/file/top-ten', fileUploadController.fileUpload(includedFileType), async(req, res, next) => {
        const body = req.body;
        const file = req.file;
        console.log('body is: ', body)
        console.log('file is: ', file)
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await ProjectHandler.projectFileHeaderHandler({ body, file });
            return responseData;
        })
    });

    app.post('/api/project/file/header', fileUploadController.fileUpload(includedFileType), async(req, res, next) => {
        const file = req.file;
        console.log('file is: ', file)
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await ProjectHandler.projectCSVJSONFileHeaderHandler({ file });
            return responseData;
        })
    });

    // not required
    app.post('/api/project/file/save-header', async(req, res, next) => {
        const body = req.body;
        console.log(body);
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await ProjectHandler.projectFileHeaderSaveHandler({ body });
            return responseData;
        })
    })

    // upload and execute API
    app.post('/api/project', multiFilesUploadController.fileUpload(includedFileType, includedFileTypeForModel), async(req, res, next) => {
        const body = _get(req, 'body');
        const files = _get(req, 'files');
        const userId = _get(req.payload, 'userId');
        console.log('body, files, userId')
        console.log(body)
        console.log(files)
        console.log(userId)
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await ProjectHandler.projectCreationHandler({ userId, body, files });
            return responseData;
        })
    })

    // add execution
    app.post('/api/exec', multiFilesUploadController.execFileUpload(includedFileType), async(req, res, next) => {
        const body = _get(req, 'body');
        const files = _get(req, 'files');
        console.log('body: ', body);
        console.log('files: ', files);

        const userId = _get(req.payload, 'userId');
        console.log("userId is: ", userId);
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await ProjectHandler.addExecHandler({ userId, body, files });
            return responseData;
        })
    })

    // not beind used anywhere
    app.post('/api/project/auto-config', async(req, res, next) => {
        const body = req.body;
        // const files = req.files;
        const userId = _get(req.payload, 'userId');
        // console.log('contains user: ', req.payload);
        baseCtrl.postAsync(req, res, next, async (_) => {
            const responseData = await ProjectHandler.autoConfigProjectExecDetailsFetchHandler({ userId, body });
            return responseData;
        })
    })

    // overview projects api
    // app.get('/api/projects', async(req, res, next) => {
    //     const userId = _get(req, 'payload.userId');
    //     const filterByProjectName = _get(req, 'query.name');
    //     const startDate = _get(req, 'query.startDate')
    //     const endDate = _get(req, 'query.endDate')
    //     const driftByPercentage = _get(req, 'query.driftByPercentage')
    //     const creatorType = _get(req, 'query.adminFilter')

    //     baseCtrl.getAsync(req, res, next, async() => {
    //         const responseData = await ProjectHandler.fetchProjectsHandler({ userId, filterByProjectName, startDate, endDate, driftByPercentage, creatorType });
    //         return responseData;
    //     })
    // })
    app.get('/api/projects', async(req, res, next) => {
        // const userId = _get(req, 'payload.userId');
        // const filterByProjectName = _get(req, 'query.name');
        // const startDate = _get(req, 'query.startDate')
        // const endDate = _get(req, 'query.endDate')
        // const driftByPercentage = _get(req, 'query.driftByPercentage')
        // const creatorType = _get(req, 'query.adminFilter')
        const userId = _get(req.payload, 'userId');
        const model = _get(req, 'query.model');
        console.log("UID",userId);
        baseCtrl.getAsync(req, res, next, async() => {
            const responseData = await ProjectHandler.fetchProjectsHandler({ userId ,model});
            return responseData;
        })
    });
    
    app.get('/api/project/manual/data-model', async(req, res, next) => {
        baseCtrl.getAsync(req, res, next, async() => {
            const responseData = await ProjectHandler.fetchProjectDataModelsHandler();
            return responseData;
        })
    })

    app.get('/api/projects/auto-configure', async(req, res, next) => {
        baseCtrl.getAsync(req, res, next, async() => {
            const responseData = await ProjectHandler.projectAutoConfigHandler();
            return responseData;
        })
    })

    // summary projects dropdown
    app.get('/api/projects/dropdowns', async(req, res, next) => {
        const userId = _get(req, 'payload.userId');
        
        baseCtrl.getAsync(req, res, next, async() => {
            const responseData = await ProjectHandler.projectDropdownHandler({ userId });
            return responseData;
        })
    })

    // project exists for user or not
    app.get('/api/projects/new-user', async(req, res, next) => {
        const userId = _get(req, 'payload.userId');
        
        baseCtrl.getAsync(req, res, next, async() => {
            const responseData = await ProjectHandler.projectUserHandler({ userId });
            return responseData;
        })
    })

    // project details for summary
    app.get('/api/project/:projectId', async(req, res, next) => {
        const userId = _get(req, 'payload.userId');
        const projectId = _get(req, 'params.projectId');
        // console.log(userId, projectId);
        baseCtrl.getAsync(req, res, next, async(_) => {
            const responseData = await ProjectHandler.projectDetailsHandler({ userId, projectId });
            return responseData;
        })
    })

    // project latestExec details for summary
    app.get('/api/project/latestExec/:projectId', async(req, res, next) => {
        const userId = _get(req, 'payload.userId');
        const projectId = _get(req, 'params.projectId');
        // console.log(userId, projectId);
        baseCtrl.getAsync(req, res, next, async(_) => {
            const responseData = await ProjectHandler.projectLatestExecDetailsHandler({ userId, projectId });
            return responseData;
        })
    })

    app.get('/api/projects/unique/projectname', async(req, res, next) => {
        const projectName = req.query.name;
        const userId = _get(req, 'payload.userId');
        console.log(projectName);
        baseCtrl.getAsync(req, res, next, async(_) => {
            const responseData = await ProjectHandler.uniqueProjectNameHandler({ projectName, userId });
            return responseData;
        })
    })

    app.post('/api/project/file/download', async(req, res, next) => {
        const userId = _get(req.payload, 'userId');
        const body = _get(req, 'body')
        console.log("download file body: ", body)
        // // console.log('contains user: ', req.payload);
        // baseCtrl.postAsync(req, res, next, async (_) => {
        //     const responseData = await ProjectHandler.fileDownloadHandler({ userId, body, res });
        //     return responseData;
        // })


        try {
            await ProjectHandler.fileDownloadHandler({ userId, body, res });
        } catch (err) {
            // throw err;
            // console.log('error found');
            // throw err;
            const statusCode = _get(err, 'error.statusCode') || _get(err, 'statusCode') || 500
            const message = _get(err, 'error.message') || _get(err, 'message') || 'Server Error';
            // console.error('============err===========', err);
            res.status(statusCode).send({ message, code: statusCode });
        }
    });

    app.post('/api/projects/file/view', async(req, res, next) => {
        
        baseCtrl.postAsync(req, res, next, async(_) => {
            const responseData = await ProjectHandler.fileViewHandler({ body: req.body });
            return responseData;
        })
    })
}
