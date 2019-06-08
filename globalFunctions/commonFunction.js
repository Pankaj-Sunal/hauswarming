"use strict";

const config = require("../config/config"),
  bitcoinClient = require("bitcoin-core"),
  Utils = require("../lib/utils"),
  async = require("async"),
  client = new bitcoinClient({
    username: global.gConfig.btc_username,
    password: global.gConfig.btc_password,
    network: global.gConfig.btc_network,
    port: global.gConfig.btc_port
  });

const listUnspent = async () => {
  try {
    let unspent = await client.listUnspent();
    return unspent;
  } catch (err) {
    //Failed to fetch unspent transactions.
    console.log(err);
  }
};

/**
 * Create a transaction spending given inputs, send to given address(es)
 *
 * @param  {Array} Transaction Object
 * @param  {String} Sending Address
 * @param  {Float} Spendable Amount
 * @return {String} Returns the hex-encoded transaction in a string
 */
const createRawTransaction = async (transactions, sendTo, amount, fee) => {
  if (fee) {
    var txFee = Utils.round(fee, "8");
    amount = amount - txFee;
    amount = Utils.round(amount, "8");
  }

  try {
    if (txFee) {
      let transactionFee = await client.setTxFee(txFee);
    }
    let rawtxid = await client.createRawTransaction(transactions, {
      [sendTo]: amount
    });
    return rawtxid;
  } catch (err) {
    console.log("error 1 -------", err);
    throw err;
  }
};

/**
 * Adds signatures to a raw transaction and returns the resulting
 * raw transaction.
 *
 * @param  {String} Hex encoded transaction
 * @return {String} Signed raw transaction
 */
const signRawTransaction = async rawTransaction => {
  try {
    let signedTransaction = await client.signRawTransaction(rawTransaction);
    return signedTransaction;
  } catch (err) {
    console.log("error 3 ---------", err);
    throw err;
  }
};

/**
 * Submits raw transaction (serialized, hex-encoded) to local node and network.
 *
 * @param  {String} Signed transaction
 * @return {String} Transaction Id
 */
const sendRawTransaction = async signedTransaction => {
  try {
    let sendTransactions = await client.sendRawTransaction(signedTransaction);
    return sendTransactions;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 * Calculate transaction fees for Regular pay-to addresses
 * (Legacy Non-segwit - P2PKH/P2SH)
 *
 * @param  {Integer} Total inputs of unspent transactions
 * @param  {Integer} Total outputs
 * @param  {Integer} # of confirmations for the transaction to calculate the transaction fees
 * @return {Double}  Transaction Fee
 */
const calculateTxFee = async (input, output, confirmations) => {
  try {
    const fee = await client.estimateSmartFee(6);
    var txFee = ((input * 148 + output * 34 + 10 + 40) / 1024) * fee["feerate"];
    return txFee;
  } catch (err) {
    throw err;
  }
};

function getTxConfirmations() {
  client.listTransactions(function(err, transactions) {
    async.forEachSeries(
      transactions,
      (element, next) => {
        if (element.confirmations >= 6 && element.category === "receive") {
          // Get all unspent transactions
          listUnspent().then(unspent => {
            var sendTransactions = unspent.filter(
              unspent => unspent.address == element.address
            );
            var listTransactions = [];
            var transactionAmount = 0;

            if (sendTransactions.length) {
              for (var transactions in sendTransactions) {
                listTransactions.push({
                  txid: sendTransactions[transactions].txid,
                  vout: sendTransactions[transactions].vout
                });
                transactionAmount += sendTransactions[transactions].amount;
              }

              calculateTxFee(listTransactions.length, 1, 6)
                .then(fee => {
                  createRawTransaction(
                    listTransactions,
                    global.gConfig.sendTo,
                    transactionAmount,
                    fee
                  )
                    .then(rawtxid => {
                      signRawTransaction(rawtxid)
                        .then(signedTransaction => {
                          sendRawTransaction(signedTransaction["hex"])
                            .then(sendTransactions => {
                              console.log({
                                code: 200,
                                "tx-hash": sendTransactions,
                                "sent-amount": transactionAmount
                              });
                              next();
                            })
                            .catch(err => {
                              console.log({ code: 500, message: err.message });
                              next();
                            });
                        })
                        .catch(err => {
                          console.log({ code: 500, message: err.message });
                          next();
                        });
                    })
                    .catch(err => {
                      console.log({ code: 500, message: err.message });
                      next();
                    });
                })
                .catch(err => {
                  console.log({ code: 500, message: err.message });
                  next();
                });
            } else {
              console.log({
                code: 500,
                message: "No unspent transaction found for given address."
              });
              next();
            }
          });
        } else {
          next();
        }
      },
      err => {
        console.log(err || "done");
      }
    );
  });
}

module.exports = {
  createRawTransaction,
  signRawTransaction,
  sendRawTransaction,
  calculateTxFee,
  listUnspent,
  getTxConfirmations
};
