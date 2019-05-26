const userController = require("../webServices/controllers/userController");

module.exports = app => {
  app.post("/signUp", userController.signUp);
  app.post("/login", userController.login);
  app.post("/forgotPassword", userController.forgotPassword);
  app.post("/imageUpload", userController.imageUpload);
  app.post("/updatePassword", userController.updatePassword);
  app.post("/logout", userController.logout);
};
