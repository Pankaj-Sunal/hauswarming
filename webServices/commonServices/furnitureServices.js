const furnitureModel = require("../../models/furnitureModel");

const addFurniture = bodyData => {
  return new Promise((resolve, reject) => {
    furnitureModel.create(bodyData, (err, result) => {
      if (!err) resolve(result);
      reject(false);
    });
  });
};

const getFurniture = query => {
  return new Promise((resolve, reject) => {
    furnitureModel.findOne(query, (err, result) => {
      if (!err) resolve(result);
      reject(false);
    });
  });
};

const getFurnitureList = (query, options) => {
  return new Promise((resolve, reject) => {
    furnitureModel.paginate(query, options, (err, result) => {
      if (!err) resolve(result);
      reject(false);
    });
  });
};

const updateFurniture = (query, set) => {
  return new Promise((resolve, reject) => {
    furnitureModel.update(query, set, { multi: false }, (err, result) => {
      console.log("%%%%%%%%%%%%%%%%%%", err || result);
      if (!err) resolve(result);
      reject(false);
    });
  });
};

module.exports = {
  addFurniture: addFurniture,
  getFurniture: getFurniture,
  updateFurniture: updateFurniture,
  getFurnitureList: getFurnitureList
};
