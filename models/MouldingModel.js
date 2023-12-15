import mongoose from "mongoose";

// Define the Mouldings schema
const mouldingSchema = new mongoose.Schema({
  group: String,
  pattern: String,
  color: String,
  finish: String,
  size: String,
  estimatedSquareFootage: Number,
  perSquareFootage: Number,
  perSheetPrice: Number,
  totalSalesPrice: Number,
  dilsXSqft: Number,
  dilsXPiece: Number,
  totalDilsCost: Number,
  dilsGrossMargin: Number,
});

const Moulding = mongoose.model("Mouldings", mouldingSchema);
export default Moulding;
