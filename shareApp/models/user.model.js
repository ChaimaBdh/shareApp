const mongoose = require('mongoose');

const userSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: true,
  },

  login: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },
  
  borrowedItems: {
                   type: [{
                     type: mongoose.ObjectId,
                     ref: 'Item'
                   }],
                   validate: [arrayLimit, 'array exceeds the limit of 2']
                 }
               });

               function arrayLimit(val) {
                 return val.length <= 2;
               }


module.exports = userSchema;

const dbConnection = require('../controllers/db.Controller');
const User = dbConnection.model('User', userSchema, 'users');

module.exports.model = User;
