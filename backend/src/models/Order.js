const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        qty: Number,
        price: Number
      }
    ],
    total: Number,
    status: { type: String, default: "CREATED" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
