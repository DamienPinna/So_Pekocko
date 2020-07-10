const Sauce = require('../models/sauce');
const fs = require('fs');


exports.manageLikeAndDislike = (req, res) => {
   console.log(req.body);
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

exports.modifySauce = async (req, res) => {
   let sauceObject;
   if (req.file) {
      const sauce = await Sauce.findOne({_id: req.params.id});
      const filenameToBeDeleted = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filenameToBeDeleted}`, error => {
         if (error) throw error;
         console.log(`${filenameToBeDeleted} a été supprimé avec succès`);
      });
      sauceObject = {
         ...JSON.parse(req.body.sauce),
         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      };
   } else {
      sauceObject = { ...req.body };
   };
   Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = async (req, res) => {
   try {
      const sauce = await Sauce.findOne({_id: req.params.id});
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
         Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({ message: 'Sauce supprimée'}))
            .catch(error => res.status(400).json({error}));
      });
   } catch (error) {
      res.status(500).json({error});
   };
};

exports.getOneSauce = (req, res) => {
   Sauce.findOne({_id: req.params.id})
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(400).json({error}));
};

exports.getAllSauces = (req, res) => {
   Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({error}));
};