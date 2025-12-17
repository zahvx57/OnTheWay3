import mongoose from "mongoose";

const PlaceSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    city: { type: String }, 
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PlaceModel = mongoose.model("Places", PlaceSchema, "Places");
export default PlaceModel;
