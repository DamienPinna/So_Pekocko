const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const db = require('./config-db');
const User = require('./models/user');

const app = express();

mongoose.connect(`mongodb+srv://${db.users}:${db.password}@flachibou-34bhw.gcp.mongodb.net/${db.name}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connexion à MongoDB réussie.'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });

app.use(bodyParser.json());

app.post('/api/auth/signup', (req, res) => {
   console.log(req.body);
   res.status(201).json({
      message: "utilisateur inscrit"
   });
});

module.exports = app;