const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sauceSchema = new Schema({
   userId: {type: String, required: true},
   name: {type: String, required: true},
   manufacturer: {type: String, required: true},
   description: {type: String, required: true},
   mainPepper: {type: String, required: true},
   imageUrl: {type: String, required: true},
   heat: {type: Number, required: true},
   likes: {type: Number, default: 0},
   dislikes: {type: Number, default: 0},
   userLiked: Array,
   userDisliked: Array
});

module.exports = mongoose.model('Sauce', sauceSchema);