const jwt = require('jsonwebtoken');
const auth = require('../config-token');

module.exports = (req, res, next) => {
   try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, `${auth.secret}`);
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