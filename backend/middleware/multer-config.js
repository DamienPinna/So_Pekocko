const multer = require('multer');

const MIME_TYPES = {
   'image/jpg': 'jpg',
   'image/jpeg': 'jpg',
   'image/png': 'png'
};

const storage = multer.diskStorage({
   destination: (req, file, callback) => {
      callback(null, 'images');
   },
   filename: (req, file, callback) => {
      const name = file.originalname.split(' ').join('_');
      const extension = MIME_TYPES[file.mimetype];
      callback(null, name + Date.now() + '.' + extension);
   }
});

const fileFilter = (req, file, callback) => {
   if(file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      callback(null, true);
   } else {
      callback(new Error("le format de l'image n'est pas accepté"), false);
   };
};

module.exports = multer({storage: storage, fileFilter: fileFilter}).single('image');