const userController = require("../webServices/controllers/userController"),
  router = require("express").Router();

router.post("/signUp", userController.signUp);
router.post("/login", userController.login);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/imageUpload", userController.imageUpload);
router.post("/updatePassword", userController.updatePassword);
router.post("/logout", userController.logout);

module.exports = router;
