const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/books');       
const auth = require('../middleware/auth');

router.post('/', auth, bookCtrl.creatBook);

router.get('/', auth, bookCtrl.getAllBooks);

router.get('/:id', auth, bookCtrl.getOneBook);

router.put('/:id', auth, bookCtrl.modifyBook);
  
router.delete('/:id', auth, bookCtrl.deleteBook);  

module.exports = router;
