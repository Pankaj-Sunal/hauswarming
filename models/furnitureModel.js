const mongoose = require("mongoose");
const schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");

const furnitureSchema = new schema(
  {
    caption: {
      type: String
    },
    imagelink: {
      type: String
    },
    tags: [
      {
        brandName: {
          type: String,
          required: true
        },
        price: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        location: {
          type: String,
          required: true
        }
      }
    ],
    likes: [
      {
        userName: String,
        userId: Schema.Types.ObjectId,
        isLike: Boolean
      }
    ]
  },
  {
    timestamps: true,
    strict: false
  }
);

furnitureSchema.plugin(mongoosePaginate);
var Furniture = mongoose.model("furniture", furnitureSchema);

module.exports = Furniture;
