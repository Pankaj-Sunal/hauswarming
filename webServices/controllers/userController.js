const bcrypt = require("bcryptjs"),
  commonFunction = require("../../globalFunctions/commonFunction"),
  userServices = require("../commonServices/userServices");

module.exports = {
  signUp: async (req, res) => {
    if (
      !req.body.email ||
      !req.body.password ||
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.profilePic
    )
      return res.send({ statusCode: 400 });
    try {
      let profilePic = await commonFunction.imageUpload(req.body.profilePic);
      if (profilePic) {
        req.body.profilePic = profilePic.file_url;
        let salt = bcrypt.genSaltSync(10);
        req.body.password = bcrypt.hashSync(req.body.password, salt);
        let user = await userServices.addUser(req.body);
        if (user) {
          return res.send({
            statusCode: 200,
            userId: user._id
          });
        } else {
          return res.send({ statusCode: 500 });
        }
      } else {
        return res.send({ statusCode: 500 });
      }
    } catch (err) {
      return res.send({ statusCode: 500 });
    }
  },

  login: async (req, res) => {
    try {
      if (!req.body.email || !req.body.password)
        return res.send({ statusCode: 400 });
      let user = await userServices.getUser({ email: req.body.email });
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password))
          return res.send({ statusCode: 200, sessionId: req.sessionID });
        return res.send({ statusCode: 400 });
      } else {
        return res.send({ statusCode: 400 });
      }
    } catch (err) {
      return res.send({ statusCode: 500 });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      if (!req.body.email) return res.send({ statusCode: 400 });
      let user = await userServices.getUser({ email: req.body.email });
      if (user) {
        let randomstring = Math.random()
          .toString(36)
          .slice(-8);
        let html = `<h2 style="font-family:times new roman;">Dear ${user.firstName ||
          "user"},<h2> </br> <p style="font-family:times new roman;"> Your New Password is ${randomstring}<p>`;
        let salt = bcrypt.genSaltSync(10);
        var set = { $set: { password: bcrypt.hashSync(randomstring, salt) } };
        let userUpdated = await userServices.updateUser(
          { email: req.body.email },
          set
        );
        if (userUpdated) {
          commonFunction.sendMail(
            req.body.email,
            "Forgot password",
            html,
            (error, sent) => {
              console.log("Mail Sent");
            }
          );
          return res.send({ statusCode: 200 });
        }
        return res.send({ statusCode: 400 });
      } else {
        return res.send({ statusCode: 400 });
      }
    } catch (err) {
      return res.send({ statusCode: 500 });
    }
  },

  imageUpload: async (req, res) => {
    if (!req.body.imageData) return res.send({ statusCode: 400 });
    let image = await commonFunction.imageUpload(imageData);
    if (image) return res.send({ statusCode: 200 });
    return res.send({ statusCode: 400 });
  },

  updatePassword: async (req, res) => {
    try {
      if (!req.body.email || !req.body.password)
        return res.send({ statusCode: 400 });
      let user = await userServices.getUser({ email: req.body.email });
      if (user) {
        let salt = bcrypt.genSaltSync(10);
        var set = {
          $set: { password: bcrypt.hashSync(req.body.password, salt) }
        };
        let userUpdated = await commonFunction.updateUser(
          { email: req.body.email },
          set
        );
        if (userUpdated) return res.send({ statusCode: 200 });
        return res.send({ statusCode: 400 });
      }
    } catch (err) {
      return res.send({ statusCode: 500 });
    }
  },

  logout: async (req, res) => {
    if (!req.body.userId || !req.body.sessionID)
      return res.send({ statusCode: 400 });
    return res.send({ statusCode: 200 });
  }
};
