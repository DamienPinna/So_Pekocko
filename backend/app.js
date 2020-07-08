const express = require('express');
const mongoose = require('mongoose');

const db = require('./config-db');

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

app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.send('Votre requête a bien été reçue !');
});

module.exports = app;