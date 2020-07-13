require('dotenv').config()
const jwt = require('jsonwebtoken');

/**
 * Authentifie un utilisateur.
 */
module.exports = (req, res, next) => {
   try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.SECRET);
      const userId = decodedToken.userId;
      if (req.body.userId && req.body.userId !== userId) {
         throw 'id utilisateur invalide';
      } else {
         next();
      };
   } catch (error) {
      res.status(401).json({error});
   };
};