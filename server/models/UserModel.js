import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  uname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profilepic: { type: String, required: false },
  adminFlag: {
    type: String,
    enum: ["Y", "N"],
    default: "N",
  },
});

const UserModel = mongoose.model("Users", UserSchema, "Users");
export default UserModel;
