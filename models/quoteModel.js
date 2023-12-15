// import mongoose from "mongoose";
const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Customer",
      required: [true, "Tell us your customer!"],
    },

    productType: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.SchemaTypes.ObjectId,
      refPath: "productType",
    },
    // Add other properties specific to each product type
    pricingDetails: mongoose.SchemaTypes.Mixed,

    finalize: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Quotes = mongoose.model("Quotes", quoteSchema);
// export default Quotes;
module.exports = Quotes;
