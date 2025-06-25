const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})
const uploads = multer({ storage: storage });

const storageTwo = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/kyc')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})
const uploadsTwo = multer({ storage: storageTwo });

const storageThree = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/qr')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})
const uploadsThree = multer({ storage: storageThree });


const storageFour = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/dp')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})
const uploadsFour = multer({ storage: storageFour });



module.exports = {
    uploads, uploadsTwo, uploadsThree, uploadsFour
}