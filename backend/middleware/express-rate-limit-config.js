const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
   windowMs: 60 * 60 * 1000, // 60 minutes
   max: 30,
   message: "Limite de requêtes autorisées atteinte pour la même adresse IP."
 });

 module.exports = limiter;