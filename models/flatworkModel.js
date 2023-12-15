import mongoose from "mongoose";

// Define the Firework schema
// const flatworkSchema = new mongoose.Schema({
//   shape: String,
//   color: String,
//   finished: String,
//   thickness: String,
//   width: String,
//   length: String,
//   estimatedFT2: String,
//   edgeFinishing: String,
//   perSquareFootage: Number,
//   perSheetPrice: Number,
//   totalSalesPrice: Number,
//   dilsXSqft: Number,
//   dilsXPiece: Number,
//   totalDilsCost: Number,
//   dilsGrossMargin: Number,
// });

const flatworkSchema = new mongoose.Schema({
  stone: String,
  color: String,
  finishedGroup: String,
  thickness: String,
  size:String,
  basePrice:Number,
  baseCost:Number
});


const Flatwork = mongoose.model("Flatwork", flatworkSchema);
export default Flatwork;
