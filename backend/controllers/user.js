require('dotenv').config()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');

/**
 * Créé un utilisateur et chiffre son mot de passe.
 */
exports.signup = async (req, res) => {
   const email = req.body.email;
   const password = req.body.password;
   const regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;

   if (regex.test(email) && password.length > 7 && password.length < 65) {
      try {
         const hash = await bcrypt.hash(password, 10);
         const user = new User({
            email: email,
            password: hash
         });
         user.save()
            .then(() => res.status(201).json({message: 'Utilisateur enregistré.'}))
            .catch(error => res.status(400).json({error}));
      } catch (error) {
         res.status(500).json({error});
      };
   } else {
      res.status(500).json({message: 'Mot de passe inférieur a 8 caractères et/ou adresse mail invalide. '})
   };
};

/**
 * Identifie un utilisateur.
 */
exports.login = async (req, res) => {
   try {
      const user = await User.findOne({email: req.body.email});
      if(!user) return res.status(404).json({error: 'Utilisateur non trouvé !'});
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