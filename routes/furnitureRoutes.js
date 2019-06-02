const furnitureController = require("../webServices/controllers/furnitureController"),
  commonFunction = require("../globalFunctions/commonFunction"),
  router = require("express").Router();

router.post(
  "/uploadFurniture",
  commonFunction.checkAuthentication,
  furnitureController.uploadFurniture
);
router.post(
  "/furnitureList",
  commonFunction.checkAuthentication,
  furnitureController.furnitureList
);
router.post(
  "/likeUnlikePost",
  commonFunction.checkAuthentication,
  furnitureController.likeUnlikePost
);

module.exports = router;
