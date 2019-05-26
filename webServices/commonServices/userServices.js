const userModel = require("../../models/userModel");

const addUser = bodyData => {
  return new Promise((resolve, reject) => {
    userModel.create(bodyData, (err, result) => {
      if (!err) resolve(result);
      reject(false);
    });
  });
};

const getUser = query => {
  return new Promise((resolve, reject) => {
    userModel.findOne(query, (err, result) => {
      if (!err) resolve(result);
      reject(false);
    });
  });
};

const updateUser = (query, set) => {
  return new Promise((resolve, reject) => {
    userModel.update(query, set, { multi: false }, (err, result) => {
      if (!err) resolve(result);
      reject(false);
    });
  });
};

module.exports = {
  addUser: addUser,
  getUser: getUser,
  updateUser: updateUser
};
