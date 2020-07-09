const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const db = require('./config-db');
const userRoutes = require('./routes/user');

const app = express();

//Connexion à la base de données MongoDB Atlas.
mongoose.connect(`mongodb+srv://${db.users}:${db.password}@flachibou-34bhw.gcp.mongodb.net/${db.name}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then(() => console.log('Connexion à MongoDB réussie.'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//CORS
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });

app.use(bodyParser.json());

app.use('/api/auth', userRoutes);

module.exports = app;