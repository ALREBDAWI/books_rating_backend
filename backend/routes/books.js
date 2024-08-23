const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/books');       
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// const { imgUpload, imgSize } = require('../middleware/multer-config');

router.post('/', auth, multer, bookCtrl.creatBook);

router.get('/', auth, bookCtrl.getAllBooks);

router.get('/:id', auth, bookCtrl.getOneBook);

router.put('/:id', auth, multer, bookCtrl.modifyBook);
  
router.delete('/:id', auth, bookCtrl.deleteBook);  

module.exports = router;
