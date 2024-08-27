
const Book = require('../models/book');
const fs = require('fs');

exports.creatBook = async (req, res, next) => {

    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.replace(/\.jpeg|\.jpg|\.png/g, "_")}thumbnail.webp`,
    });
  
    await book.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
  };

  exports.getAllBooks = (req, res, next) => {  //books gallery
    Book.find()
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));
  
  };

  

  exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));
  };

  exports.modifyBook = (req, res, next) => {

    const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.replace(/\.jpeg|\.jpg|\.png/g, "_")}thumbnail.webp`,
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized for modification'});
          } else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Object is modified!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
  };


  exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'book is deleted !'}))
      .catch(error => res.status(400).json({ error }));
  };



  
  exports.bestRating = async (req, res, next) => {
    try {
      const books = await Book.find().sort({ averageRating: -1 }).limit(3);
      if (books.length === 0) {
        return res.status(404).json({ error });
      }
      res.status(200).json(books);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: err });
    }
    
  };



  exports.ratingBooks = async (req, res, next) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const isAlreadyRated = book.ratings.find(rating => rating.userId === req.auth.userId);

        if (!isAlreadyRated) {
            // Add new rating
            book.ratings.push({
                userId: req.auth.userId,
                grade: req.body.rating
            });

            // Calculate new average rating
            const newAverageRating = book.ratings.reduce((accumulator, currentValue) => 
                accumulator + currentValue.grade, 0) / book.ratings.length;

            book.averageRating = newAverageRating;

            // Save the updated book
            const updatedBook = await book.save();

            // Return the updated book as the response
            return res.status(201).json(updatedBook);
        } else {
            // If the book is already rated by this user, return a 401 response
            return res.status(401).json({ message: 'Book is already rated by this user' });
        }
    } catch (error) {
        // Handle any errors that occur
        return res.status(500).json({ error });
    }
};
