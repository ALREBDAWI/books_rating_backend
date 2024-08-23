
const book = require('../models/book');
const fs = require('fs');

exports.creatBook = (req, res, next) => {
    // delete req.body._id;
    // const book = new bookSchema({
    //   ...req.body
    // });
    // book.save()
    //   .then(() => res.status(201).json({ message: 'book is posted !'}))
    //   .catch(error => res.status(400).json({ error }));
    //   next();
    const bookObject = JSON.parse(req.body.Book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    book.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
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
    // book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    //   .then(() => res.status(200).json({ message: 'book is modified !'}))
    //   .catch(error => res.status(400).json({ error }));
    //   next();
    const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              book.updateOne({ _id: req.params.id}, { ...nookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
  };

  exports.deleteBook = (req, res, next) => {
    book.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'book is deleted !'}))
      .catch(error => res.status(400).json({ error }));
  };