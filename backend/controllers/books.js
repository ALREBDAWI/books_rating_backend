
const Book = require('../models/book');
const fs = require('fs');

  exports.createBook = async (req, res, next) => {
    try {
      const bookObject = JSON.parse(req.body.book);

      // should not be manually set
      delete bookObject._id;
      delete bookObject.userId;

      // Validation
      if (!req.file || !bookObject.title || !bookObject.author) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.replace(/\.(jpeg|jpg|png)/g, "_")}thumbnail.webp`,
      });

      await book.save();
      return res.status(201).json({ message: 'Book created successfully!' });

    } catch (error) {
      return res.status(500).json({ message: 'an unexpected error occured' });
    }
  };

 

  exports.getAllBooks = async (req, res, next) => {
    try {
      // Fetch all books from the database
      const books = await Book.find();
      return res.status(200).json(books);
  
    } catch (error) {
      return res.status(500).json({ message: 'an unexpected error occured' });
    }
  };

  

  exports.getOneBook = async (req, res, next) => {
    try {
      const book = await Book.findOne({ _id: req.params.id });
  
      if (!book) {
        return res.status(404).json({ message: 'Book not found' }); //existing books only
      }
  
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json({ message: 'an unexpected error occured' });
    }
  };
  

  exports.modifyBook = async (req, res, next) => {
    try {
      // Parse the book object and handle the imageUrl if a file is provided
      const bookObject = req.file
        ? {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.replace(
              /\.jpeg|\.jpg|\.png/g,
              "_"
            )}thumbnail.webp`,
          }
        : { ...req.body };
  
      delete bookObject.userId; // Prevent userId from being modified
  
      const book = await Book.findOne({ _id: req.params.id });
  
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }
  
      await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });
      res.status(200).json({ message: 'Object is modified!' });
    } catch (error) {
      res.status(500).json({ message: 'an unexpected error occured' });
    }
  };
  


  exports.deleteBook = async (req, res, next) => {
    try {
      const book = await Book.findOne({ _id: req.params.id });
  
      if (!book) {
        return res.status(404).json({ message: 'Book not found' }); // book does not exist in DB case
      }
  
      if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }
  
      await Book.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Book is deleted!' });
    } catch (error) {
      res.status(500).json({ message: 'an unexpected error occured' });
    }
  };



  
  exports.bestRating = async (req, res, next) => {
    try {
      const books = await Book.find().sort({ averageRating: -1 }).limit(3);
      if (books.length === 0) {
        return res.status(404).json({ message: 'no books found' });  
      }
      res.status(200).json(books);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'an unexpected error occured' });
    }
    
  };



  exports.ratingBooks = async (req, res, next) => {    //rating between 0 and 5 fix 
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
