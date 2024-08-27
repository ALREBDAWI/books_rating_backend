const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/books');       
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const Sharp = require('../middleware/sharp-config');

router.post('/', auth, multer, Sharp, bookCtrl.creatBook);

router.get('/', bookCtrl.getAllBooks);

router.use('/bestrating', bookCtrl.bestRating);

router.get('/:id', bookCtrl.getOneBook);

router.put('/:id', auth, multer, Sharp, bookCtrl.modifyBook);
  
router.delete('/:id', auth, bookCtrl.deleteBook);  

router.post('/:id/rating', auth, bookCtrl.ratingBooks);



module.exports = router;
