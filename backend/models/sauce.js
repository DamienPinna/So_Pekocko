const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sauceSchema = new Schema({
   userId: {type: String, required: true},
   name: {type: String, required: true},
   manufacturer: {type: String, required: true},
   description: {type: String, required: true},
   mainPapper: {type: String, required: true},
   imageUrl: {type: String, required: true},
   heat: {type: Number, required: true},
   likes: {type: Number, required: true},
   dislikes: {type: Number, required: true},
   userLiked: {type: Array, required: true},
   userDisliked: {type: Array, required: true}
});

module.exports = mongoose.model('Sauce', sauceSchema);