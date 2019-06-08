const transactionHistoryModel = require("../../models/transactionHistoryModel");

const addTransactionHistory = bodyData => {
  return new Promise((resolve, reject) => {
    transactionHistoryModel.create(bodyData, (err, result) => {
      if (!err) resolve(result);
      reject(false);
    });
  });
};

const getTransaction = query => {
  return new Promise((resolve, reject) => {
    transactionHistoryModel.findOne(query, (err, result) => {
      if (!err) resolve(result);
      reject(false);
    });
  });
};

const updateTransaction = (query, set) => {
  return new Promise((resolve, reject) => {
    transactionHistoryModel.update(
      query,
      set,
      { multi: false },
      (err, result) => {
        if (!err) resolve(result);
        reject(false);
      }
    );
  });
};

const deleteTransaction = query => {
  return new Promise((resolve, reject) => {
    transactionHistoryModel.remove(query, (err, result) => {
      if (!err) resolve(result);
      reject(false);
    });
  });
};

module.exports = {
  addTransactionHistory: addTransactionHistory,
  getTransaction: getTransaction,
  updateTransaction: updateTransaction,
  deleteTransaction: deleteTransaction
};
