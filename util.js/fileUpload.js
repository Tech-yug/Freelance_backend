const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: path.join(__dirname, '..' + '/public/uploads'),
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
function checkFileType(file, cb){
// Allowed extension name
const filetypes = /jpeg|jpg|png|gif/;
// Check ext
const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
const mimetype = filetypes.test(file.mimetype);

if(mimetype && extname){
    return cb(null,true);
} else {
    cb('Error: Images Only!');
}
}

const upload = multer({
    storage: storage,
    limits:{fileSize: 24 * 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  })

module.exports = upload