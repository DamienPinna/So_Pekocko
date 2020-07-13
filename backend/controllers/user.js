require('dotenv').config()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');

/**
 * Créé un utilisateur et chiffre son mot de passe.
 */
exports.signup = async (req, res) => {
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
   };
};

/**
 * Identifie un utilisateur.
 */
exports.login = async (req, res) => {
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
               process.env.SECRET,
               {expiresIn: '24h'}
            )
         });
      } catch (error) {
         res.status(500).json({error});
      };
   } catch (error) {
      res.status(500).json({error});
   };
};