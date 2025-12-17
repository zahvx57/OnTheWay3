import mongoose from "mongoose";

const DelegateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },       
    fee: { type: Number, required: true },         
    rating: { type: Number, default: 4.5 },
    avatar: { type: String },
    place: { type: String, required: true },
  },
  { timestamps: true }
);

const DelegateModel = mongoose.model("Delegate", DelegateSchema, "Delegates");

export default DelegateModel;
