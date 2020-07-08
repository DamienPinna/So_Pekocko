const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('./config-db');
const token = require('./config-token');
const User = require('./models/user');

const app = express();

mongoose.connect(`mongodb+srv://${db.users}:${db.password}@flachibou-34bhw.gcp.mongodb.net/${db.name}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then(() => console.log('Connexion à MongoDB réussie.'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });

app.use(bodyParser.json());

app.post('/api/auth/signup', async (req, res) => {
   try {
      const hash = await bcrypt.hash(req.body.password, 10);
      const user = new User({
         email: req.body.email,
         password: hash
      });
      user.save()
         .then(() => res.status(201).json({message: 'Utilisateur enregistré.'}))
         .catch(error => res.status(400).json({error}));
   } catch (error) {
      res.status(500).json({error});
   }
});

app.post('/api/auth/login', async (req, res) => {
   try {
      const user = await User.findOne({email: req.body.email});
      if(!user) return res.status(401).json({error: 'Utilisateur non trouvé !'});
      try {
         const valid = await bcrypt.compare(req.body.password, user.password);
         if(!valid) return res.status(401).json({error: 'Mot de passe incorrect.'});
         res.status(200).json({
            userId: user._id,
            token: jwt.sign(
               {userId: user._id},
               `${token.secret}`,
               {expiresIn: '24h'}
            )
         });
      } catch (error) {
         res.status(500).json({error});
      };
   } catch (error) {
      res.status(500).json({error});
   };
});

module.exports = app;