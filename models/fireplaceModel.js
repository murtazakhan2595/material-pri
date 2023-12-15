import mongoose from "mongoose";

const fireplaceSchema = new mongoose.Schema({
  groupType: {
    type: String,
    required: [true, "please select the group type"],
  },
  materialType: {
    type: String,
    required: [true, "please select the material type"],
  },
  size:String,
  basePrice:Number,
  color:String
});

const Fireplace = mongoose.model("Fireplace", fireplaceSchema);
export default Fireplace;
