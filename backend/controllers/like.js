const Sauce = require('../models/sauce');

/**
 * Gère les likes et les dislikes.
 */
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
      case 0:
         if (indexUserIdInUserLiked !== -1) {
            likeAndDislikeUpdate.likes -= 1;
            likeAndDislikeUpdate.userLiked.splice(indexUserIdInUserLiked, 1);
            res.status(200).json({ message: "Annulation du like effectuée."});
         } else {
            likeAndDislikeUpdate.dislikes -= 1;
            likeAndDislikeUpdate.userDisliked.splice(indexUserIdInUserDisliked, 1);
            res.status(200).json({ message: "Annulation du dislike effectuée."});
         }
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