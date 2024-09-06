const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
  userId: { type: String, required: true },
  grade: { type: Number, required: true, min: 1, max: 5 } 
});

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true, min: 1450 }, 
  genre: { type: String, required: true, trim: true },
  ratings: [ratingSchema],
  averageRating: { type: Number, required: true, min: 0, max: 5 }
});

module.exports = mongoose.model('Book', bookSchema);
