const Sauce = require('../models/sauce');

exports.getAllSauces = (req, res) => {
   Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({error}));
};

exports.createSauce = (req, res) => {
   const sauceObject = JSON.parse(req.body.sauce);
   delete sauceObject._id;
   const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   });
   sauce.save()
    .then(() => res.status(201).json({message: 'Sauce enregistrée'}))
    .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res) => {
   Sauce.findOne({_id: req.params.id})
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(400).json({error}));
};