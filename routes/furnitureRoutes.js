const furnitureController = require("../webServices/controllers/furnitureController");

module.exports = app => {
  app.post("/uploadFurniture", furnitureController.uploadFurniture);
  app.get(
    "/furnitureList/:userId/:sessionId",
    furnitureController.furnitureList
  );
  app.post("/likeUnlikePost", furnitureController.likeUnlikePost);
};
