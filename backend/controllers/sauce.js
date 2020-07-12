const fs = require('fs');
const Sauce = require('../models/sauce');

exports.manageLikeAndDislike = async (req, res) => {
   const sauce = await Sauce.findOne({_id: req.params.id});

   const likeAndDislikeUpdate = {
      likes: sauce.likes,
      dislikes: sauce.dislikes,
      userLiked: sauce.userLiked,
      userDisliked: sauce.userDisliked
   };
   const indexUserIdInUserLiked = sauce.userLiked.findIndex(userIdInUserLiked => userIdInUserLiked === req.body.userId);
   const indexUserIdInUserDisliked = sauce.userDisliked.findIndex(userIdInUserDisliked => userIdInUserDisliked === req.body.userId);

   switch (req.body.like) {
      //L'utilisateur aime la sauce.
      case 1:
         if (indexUserIdInUserLiked === -1 && indexUserIdInUserDisliked === -1) {
            likeAndDislikeUpdate.likes += 1;
            likeAndDislikeUpdate.userLiked.push(req.body.userId);
         } else if (indexUserIdInUserLiked === -1 && indexUserIdInUserDisliked !== -1) {
            likeAndDislikeUpdate.likes += 1;
            likeAndDislikeUpdate.dislikes -= 1;
            likeAndDislikeUpdate.userLiked.push(req.body.userId);
            likeAndDislikeUpdate.userDisliked.splice(indexUserIdInUserDisliked, 1);
         } else {
            res.status(200).json({ message: "L'utilisateur aime déjà la sauce."});
         };
         break;
      //L'utilisateur annule ce qu'il aime ou n'aime pas.
      case 0: console.log(0);
         break;
      //L'utilisateur n'aime pas la sauce.
      case -1:
         if (indexUserIdInUserDisliked === -1 && indexUserIdInUserLiked === -1) {
            likeAndDislikeUpdate.dislikes += 1;
            likeAndDislikeUpdate.userDisliked.push(req.body.userId);
         } else if (indexUserIdInUserDisliked === -1 && indexUserIdInUserLiked !== -1) {
            likeAndDislikeUpdate.dislikes += 1;
            likeAndDislikeUpdate.likes -= 1;
            likeAndDislikeUpdate.userDisliked.push(req.body.userId);
            likeAndDislikeUpdate.userLiked.splice(indexUserIdInUserLiked, 1);
         } else {
            res.status(200).json({ message: "L'utilisateur n'aime déjà pas la sauce."});
         };
         break;
      default: console.log('Erreur dans la requête !');
   }
   Sauce.updateOne({ _id: req.params.id }, {...likeAndDislikeUpdate, _id: req.params.id})
      .then(() => res.status(200).json({ message: 'Like'}))
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