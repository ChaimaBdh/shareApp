const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema ({
  description: {
    type: String,
    required: true,
  },
  statut: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const dbConnection = require('../controllers/db.Controller');
const Item = dbConnection.model('Item', itemSchema);

module.exports.model = Item;
