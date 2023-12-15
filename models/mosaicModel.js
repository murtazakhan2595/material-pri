import mongoose from "mongoose";

// Define the Mosaic schema
const mosaicSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Please tell us mosaic type!"],
  },
  color: {
    type: String,
    required: [true, "Please tell us mosaic color!"],
  },
  stone: {
    type: String,
    required: [true, "Please tell us mosaic stone!"],
  },
  group: {
    type: String,
    required: [true, "Please tell us mosaic group!"],
  },
  cost: Number,
  price: Number,
});

const Mosaic = mongoose.model("Mosaic", mosaicSchema);
export default Mosaic;
