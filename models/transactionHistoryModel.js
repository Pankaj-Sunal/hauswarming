const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const schema = mongoose.Schema;

const transactionHistory = new schema(
  {
    amount: String,
    fee: String,
    confirmations: String,
    blockhash: String,
    blockindex: String,
    blocktime: String,
    txid: String,
    time: String,
    timereceived: String,
    details: [
      {
        address: String,
        category: String,
        amount: String,
        label: String,
        vout: String,
        fee: String,
        abondoned: Boolean
      }
    ],
    coinType: {
      type: String,
      enum: ["BTC", "LTC", "USDT", "DOGE", "BCH", "EOS", "XRP"]
    },
    notified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

transactionHistory.plugin(mongoosePaginate);
module.exports = mongoose.model("transactionHistory", transactionHistory);
