const userController = require("../webServices/controllers/userController"),
  commonFunction = require("../globalFunctions/commonFunction"),
  router = require("express").Router();

router.post("/signUp", userController.signUp);
router.post("/login", commonFunction.checkAuthentication, userController.login);
router.post(
  "/forgotPassword",
  commonFunction.checkAuthentication,
  userController.forgotPassword
);
router.post(
  "/imageUpload",
  commonFunction.checkAuthentication,
  userController.imageUpload
);
router.post(
  "/updatePassword",
  commonFunction.checkAuthentication,
  userController.updatePassword
);
router.post(
  "/logout",
  commonFunction.checkAuthentication,
  userController.logout
);

module.exports = router;
