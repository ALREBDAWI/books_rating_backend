
const book = require('../models/book')

exports.creatBook = (req, res, next) => {
    delete req.body._id;
    const book = new bookSchema({
      ...req.body
    });
    book.save()
      .then(() => res.status(201).json({ message: 'book is posted !'}))
      .catch(error => res.status(400).json({ error }));
      next();
  };

  exports.getAllBooks = (req, res, next) => {
    book.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
      next();
  };

  exports.getOneBook = (req, res, next) => {
    book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));
      next();
  };

  exports.modifyBook = (req, res, next) => {
    book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'book is modified !'}))
      .catch(error => res.status(400).json({ error }));
      next();
  };

  exports.deleteBook = (req, res, next) => {
    book.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'book is deleted !'}))
      .catch(error => res.status(400).json({ error }));
  };