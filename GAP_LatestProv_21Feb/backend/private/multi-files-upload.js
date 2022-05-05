const multer = require('multer');
const { isEqual: _isEqual } = require('lodash');

const storage = multer.diskStorage({
     destination: (req, file, callback) => {
         callback(null, 'uploads');
     },
     filename: (req, file, callback) => {

         callback(null, Date.now() + '-' + file.originalname );
     }
 });


const createFileFilter = (includedFileType, includedFileTypeForModel) => {
    
    return function (req, file, cb) {
        let allowedMimes;
        if (_isEqual('model', file.fieldname)) {
            allowedMimes = includedFileTypeForModel;
        } else {
            allowedMimes = includedFileType;
        }
        console.log('file in createFilter: ', file);
        // var allowedMimes = includedFileType;

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb({
                success: false,
                message: 'Only .csv and .json  format allowed!'
            }, false);
        }
    };
};

exports.fileUpload = (includedFileType, includedFileTypeForModel) => {
    return (req, res, next) => {
        const fileFilter = createFileFilter(includedFileType, includedFileTypeForModel);
        let obj = {
            storage: storage,
            limits: {
                fileSize: 200 * 1024 * 1024 // 200MB?
            },
            fileFilter: fileFilter
        };
        
        // const upload = multer(obj).array('file', 3); // upload multiple ('file')
        const upload = multer(obj);
        const multpleUploads = upload.fields([
            {
                name: 'train',
                maxCount: 1
            },
            {
                name: 'test',
                maxCount: 1
            },
            {
                name: 'model',
                maxCount: 1
            }
        ])
        multpleUploads(req, res, function (error) {
            if (error) { //instanceof multer.MulterError
                res.status(500);
                if (error.code == 'LIMIT_FILE_SIZE') {
                    error.message = 'File Size is too large. Allowed file size is 200KB';
                    error.success = false;
                }
                return res.json(error);
            } else {
                // for executionType drift, test and train both should be there
                // for executionType explainability, test and model both should be there
                // for executionType containing both drift and explainability, test, train and model all three should be there
                if (!(req.body.executionType && req.body.executionType.length > 0)) {
                    res.status(500);
                    return res.json({
                        "message": 'execution-type can not be empty',
                        "code": 500
                    });
                } 
                // drift: train and test required, no model
                // XAI: train and model required,  no test
                if (req.body.executionType.includes('drift') && !req.body.executionType.includes('explainability')) {
                    if (!req.files.train || !req.files.test) {
                        res.status(500);
                        return res.json({
                            "message": "train or test file not found",
                            "code": 500
                        });
                    }
                    next()
                } else if (req.body.executionType.includes('explainability') && !req.body.executionType.includes('drift')) {
                    if (!req.files.test || !req.files.model) { // to check this
                        res.status(500);
                        return res.json({
                            "message": "test or model file not found",
                            "code": 500
                        });
                    }
                    next();
                } else if (req.body.executionType.includes('explainability') && req.body.executionType.includes('drift')) {
                    if (!req.files.test || !req.files.model || !req.files.train) {
                        res.status(500);
                        return res.json({
                            "message": "train or test or model file not found",
                            "code": 500
                        });
                    }
                    next();
                }    
            }
        });
    };
    
};

const createExecFileFilter = (includedFileType) => {
    
    return function (req, file, cb) {
        let allowedMimes;
        allowedMimes = includedFileType;
        console.log('file in createExecFileFilter: ', file);

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb({
                success: false,
                message: 'Only .csv and .json  format allowed!'
            }, false);
        }
    };
};

exports.execFileUpload = (includedFileType) => {
    return (req, res, next) => {
        const fileFilter = createExecFileFilter(includedFileType);
        let obj = {
            storage: storage,
            limits: {
                fileSize: 200 * 1024 * 1024 // 200MB?
            },
            fileFilter: fileFilter
        };
        
        const upload = multer(obj);
        const multpleUploads = upload.fields([
            {
                name: 'train',
                maxCount: 1
            },
            {
                name: 'test',
                maxCount: 1
            }
        ])
        multpleUploads(req, res, function (error) {
            if (error) { //instanceof multer.MulterError
                res.status(500);
                if (error.code == 'LIMIT_FILE_SIZE') {
                    error.message = 'File Size is too large. Allowed file size is 200KB';
                    error.success = false;
                }
                return res.json(error);
            }
            next()
        });
    };
    
};