const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

var User = mongoose.model("user", userSchema);

module.exports = User;
