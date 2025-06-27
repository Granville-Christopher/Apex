const multer = require("multer");
let storage = multer.memoryStorage()

let fileFilter = (req, file, cb) => {
    // Ensure file name doesn't cause issues
    file.originalname = file.originalname.replace(/[^\w\s.-]/gi, '');
    cb(null, true);
};

let upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

module.exports = upload