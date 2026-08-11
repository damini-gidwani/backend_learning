const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  type: {
    type: String,
    enum: ["home", "office", "hostel", "other"],
    required: true,
  },
  address: {
    type: String,
    requires: true,
  },
  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  pincode: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  }
});
addressSchema.index({location:"2dsphere"})
const addressModel = mongoose.model("address", addressSchema);
module.exports = addressModel;
