const furnitureController = require("../webServices/controllers/furnitureController"),
  router = require("express").Router();

router.post("/uploadFurniture", furnitureController.uploadFurniture);
router.post("/furnitureList", furnitureController.furnitureList);
router.post("/likeUnlikePost", furnitureController.likeUnlikePost);

module.exports = router;
