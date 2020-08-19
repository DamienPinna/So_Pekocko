const CryptoJS = require('crypto-js');
const User = require('../models/user');

module.exports = async (req, res, next) => {
   const users = await User.find({});

   let mailIsUnique = true;

   users.forEach((element) => {
      let bytes  = CryptoJS.AES.decrypt(element.email, process.env.KEY);
      let originalEmail = bytes.toString(CryptoJS.enc.Utf8);
   
      if (originalEmail === req.body.email) {
         res.status(409).json({message: 'Adresse mail déjà utilisée'});
         mailIsUnique = false;
      };
   });
   
   if (mailIsUnique) {
      next();
   };
};