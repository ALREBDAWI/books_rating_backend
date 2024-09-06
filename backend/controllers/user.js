const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //definir le format de l'email
exports.signup = (req, res, next)=>{
    if(!emailFormat.test(req.body.email)){
        return res.status(400).json({ error: 'email format invalid' })
    };
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({message: 'new user created !' }))
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next)=>{
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Incorrect password or email'});
        }
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ message: 'Incorrect password or email' });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        process.env.ACCESS_TOKEN_SECRET ,
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};