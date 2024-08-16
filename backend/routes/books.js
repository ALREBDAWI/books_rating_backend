const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/books');       

router.post('/', bookCtrl.creatBook);

router.use('/', bookCtrl.getAllBooks);

router.get('/:id', bookCtrl.getOneBook);

router.put('/:id', bookCtrl.modifyBook);
  
router.delete('/:id', bookCtrl.deleteBook);  

module.exports = router;
