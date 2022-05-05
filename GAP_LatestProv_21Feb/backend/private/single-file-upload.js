const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
     destination: (req, file, callback) => {
         let dest = path.join(__dirname, '../../', 'uploads')
        //  callback(null, 'uploads');
        console.log('dest is: ', dest);
        console.log('__dirname is: ', __dirname);
         callback(null, dest);
     },
     filename: (req, file, callback) => {

         callback(null, Date.now() + '-' + file.originalname );
     }
 });


const createFileFilter = (includedFileType) => {
    
    return function (req, file, cb) {
        var allowedMimes = includedFileType;
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

exports.fileUpload = (includedFileType) => {
    return (req, res, next) => {
        const fileFilter = createFileFilter(includedFileType);
        let obj = {
            storage: storage,
            limits: {
                fileSize: 200 * 1024 * 1024 // 200MB
            },
            fileFilter: fileFilter
        };
        const upload = multer(obj).single('file'); // upload.single('file')
        const start = Date.now();
        upload(req, res, function (error) {
            if (error) { //instanceof multer.MulterError
                res.status(500);
                if (error.code == 'LIMIT_FILE_SIZE') {
                    error.message = 'File Size is too large. Allowed file size is 200KB';
                    error.success = false;
                }
                return res.json(error);
            } else {
                if (!req.file) {
                    res.status(500);
                    res.json('file not found');
                }
                console.log('upload time: ', Date.now() - start);
                next();
            }
        });
    };
    
};