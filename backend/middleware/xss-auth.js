module.exports = (req, res, next) => {
   const userObject = req.body;
   const regex = /<|>|"|&/;
   isDangerous = regex.test(userObject.email) || regex.test(userObject.password);
   if (isDangerous) {
      res.status(500).json({message: 'Attaque XSS suspectée.'})
   } else {
      next();
   };
};