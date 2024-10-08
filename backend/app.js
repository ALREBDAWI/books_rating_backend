

const express = require('express');

const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');
const path = require('path');

const mongoose = require('mongoose');

require('dotenv').config();

console.log(process.env.DB_PASSWORD+' test');
mongoose.connect('mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASSWORD+'@cluster0.ogdde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    { useNewUrlParser: true,
        useUnifiedTopology: true })

        .then(() => console.log('connected to mongoDB succesfully !'))
        .catch(() => console.log('probleme with connection to mongoDB'));        


const app = express();


app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);
module.exports = app;