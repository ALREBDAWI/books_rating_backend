const multer = require('multer');
const sharp = require('sharp');

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

// const imgUpload = multer({
//   storage: storage,
//   fileFilter: (req, file, callback) => {
//       if (MIME_TYPES[file.mimetype]) {
//           callback(null, true);
//       } else {
//           callback(new Error('Fichier invalide'));
//       }
//   },
// }).single('image');

// const imgSize = async (req, res, next) => {
//   if (!req.file) {
//       return next()
//   }
//   const imgPath = req.file.path //chemin de l'image
//   try {
//       const imgBuffer = await sharp(imgPath)
//           .resize({ width: 200, height: 250 }) //redimensionnement de l'image
//           .toBuffer();
//       await sharp(imgBuffer)
//            .toFile(imgPath);
//       next();
//   } catch (error) {
//       next(error);
//   }
// };

// module.exports = { imgUpload, imgSize };
module.exports = multer({storage: storage}).single('image');