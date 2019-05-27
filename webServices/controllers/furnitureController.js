const commonFunction = require("../../globalFunctions/commonFunction"),
  furnitureServices = require("../commonServices/furnitureServices"),
  mongoose = require("mongoose");

module.exports = {
  uploadFurniture: async (req, res) => {
    if (!req.body.caption || !req.body.imageLink || !req.body.tags.length)
      return res.send({ statusCode: 400 });

    let furniture = await furnitureServices.addFurniture(req.body);
    if (furniture) return res.send({ statusCode: 200 });
    return res.send({ statusCode: 400 });
  },

  furnitureList: async (req, res) => {
    if (!req.body.userId || !req.body.page)
      return res.send({ statusCode: 400 });
    var options = { page: req.body.page, limit: req.body.limit || 20 };
    let furnitureList = await furnitureServices.getFurnitureList({}, options);
    if (furnitureList)
      return res.send({ statusCode: 200, furnitureList: furnitureList });
    return res.send({ statusCode: 400 });
  },

  likeUnlikePost: async (req, res) => {
    if (!req.body.userId || !req.body.postId || req.body.isLike === undefined)
      return res.send({ statusCode: 400 });
    let furnitureData = await furnitureServices.getFurniture({
      likes: {
        $elemMatch: { userId: mongoose.Types.ObjectId(req.body.userId) }
      },
      _id: req.body.postId
    });
    if (furnitureData) {
      var query = {
        _id: req.body.postId,
        "likes.userId": mongoose.Types.ObjectId(req.body.userId)
      };
      var set = { $set: { "likes.$.isLike": req.body.isLike } };
    } else {
      var query = {
        _id: req.body.postId
      };
      var set = {
        $push: { likes: { userId: req.body.userId, isLike: req.body.isLike } }
      };
    }
    let furniture = await furnitureServices.updateFurniture(query, set);
    if (furniture) return res.send({ statusCode: 200 });
    return res.send({ statusCode: 400 });
  }
};
