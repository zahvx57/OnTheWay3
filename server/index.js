import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import UserModel from "./models/UserModel.js";
import PlaceModel from "./models/PlaceModel.js";
import DelegateModel from "./models/DelegateModel.js";

const app = express();
app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    const conStr =
      "mongodb+srv://admin:1234@cluster0.fdhdemo.mongodb.net/OnTheWay?appName=Cluster0";

    await mongoose.connect(conStr);
    console.log("Database Connected..");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log("Server connected at port", PORT));
  } catch (error) {
    console.log("Database connection error..", error);
  }
};
startServer();

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found..." });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid Credentials.." });

    const safeUser = {
      _id: user._id,
      uname: user.uname,
      email: user.email,
      profilepic: user.profilepic,
      phone: user.phone,
      adminFlag: user.adminFlag,
    };

    return res.status(200).json({ user: safeUser, message: "Success" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { uname, email, password, profilepic, phone } = req.body;

    if (!uname || !email || !password)
      return res.status(400).json({ message: "uname, email, password are required." });

    const exists = await UserModel.findOne({ email });
    if (exists) return res.status(409).json({ message: "User already exists..." });

    const hash_password = await bcrypt.hash(password, 10);

    const new_user = new UserModel({
      uname,
      email,
      password: hash_password,
      profilepic: profilepic || "",
      phone: phone || "",
      adminFlag: "N",
    });

    await new_user.save();
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/getUsers", async (req, res) => {
  try {
    const users = await UserModel.find().select("-password").sort({ uname: 1 });
    return res.status(200).json({ users });
  } catch (error) {
    console.error("getUsers error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.put("/user/profile", async (req, res) => {
  try {
    const { currentEmail, uname, email, phone, pic } = req.body;

    if (!currentEmail)
      return res.status(400).json({ message: "Current email is required." });

    const user = await UserModel.findOne({ email: currentEmail });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (email && email !== currentEmail) {
      const existing = await UserModel.findOne({ email });
      if (existing) {
        return res.status(400).json({
          message: "This email is already in use by another account.",
        });
      }
      user.email = email;
    }

    if (uname !== undefined) user.uname = uname;
    if (phone !== undefined) user.phone = phone;
    if (pic !== undefined) user.profilepic = pic;

    await user.save();

    const safeUser = {
      _id: user._id,
      uname: user.uname,
      email: user.email,
      profilepic: user.profilepic,
      phone: user.phone,
      adminFlag: user.adminFlag,
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: safeUser,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ message: "Error updating profile." });
  }
});

app.put("/user/password", async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Email, current password and new password are required.",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("Error changing password:", err);
    return res.status(500).json({ message: "Error changing password." });
  }
});

app.get("/getPlaces", async (req, res) => {
  try {
    const places = await PlaceModel.find().sort({ name: 1 });
    return res.status(200).json({ places });
  } catch (err) {
    console.error("Error fetching places:", err);
    return res.status(500).json({ message: "Error fetching places." });
  }
});

app.get("/places", async (req, res) => {
  try {
    const places = await PlaceModel.find().sort({ name: 1 });
    return res.status(200).json(places);
  } catch (err) {
    console.error("Error fetching places:", err);
    return res.status(500).json({ message: "Error fetching places." });
  }
});

app.post("/addPlace", async (req, res) => {
  try {
    const { name, city, email, adminFlag } = req.body;

    let isAdmin = false;

    if (email) {
      const adminUser = await UserModel.findOne({ email });
      isAdmin = !!adminUser && adminUser.adminFlag === "Y";
    } else if (adminFlag) {
      isAdmin = adminFlag === "Y";
    }

    if (!isAdmin) return res.status(403).json({ message: "Admin only." });

    if (!name || !name.trim())
      return res.status(400).json({ message: "Place name is required." });

    const exists = await PlaceModel.findOne({ name: name.trim() });
    if (exists) return res.status(409).json({ message: "Place already exists." });

    const newPlace = new PlaceModel({
      name: name.trim(),
      city: city || "",
    });

    await newPlace.save();

    const places = await PlaceModel.find().sort({ name: 1 });
    return res.status(200).json({ message: "Place added successfully.", places });
  } catch (err) {
    console.error("Error adding place:", err);
    return res.status(500).json({ message: "Error adding place." });
  }
});

app.put("/admin/place/:id", async (req, res) => {
  try {
    const { email, name, city } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required." });

    const adminUser = await UserModel.findOne({ email });
    if (!adminUser || adminUser.adminFlag !== "Y") {
      return res.status(403).json({ message: "Admin only." });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Place name is required." });
    }

    const place = await PlaceModel.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found." });

    const oldName = place.name;
    const newName = name.trim();

    place.name = newName;
    place.city = city || "";
    await place.save();

    if (oldName !== newName) {
      await DelegateModel.updateMany({ place: oldName }, { $set: { place: newName } });
    }

    return res.status(200).json({ message: "Updated", place });
  } catch (err) {
    console.error("Error updating place:", err);
    return res.status(500).json({ message: "Error updating place." });
  }
});

app.delete("/admin/place/:id", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required." });

    const adminUser = await UserModel.findOne({ email });
    if (!adminUser || adminUser.adminFlag !== "Y") {
      return res.status(403).json({ message: "Admin only." });
    }

    const place = await PlaceModel.findById(req.params.id);
    if (place?.name) {
      await DelegateModel.deleteMany({ place: place.name });
    }

    await PlaceModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Deleted" });
  } catch (err) {
    console.error("Error deleting place:", err);
    return res.status(500).json({ message: "Error deleting place." });
  }
});

app.get("/getDelegates", async (req, res) => {
  try {
    const delegates = await DelegateModel.find().sort({ name: 1 });
    return res.status(200).json({ delegates });
  } catch (err) {
    console.error("Error fetching delegates:", err);
    return res.status(500).json({ message: "Error fetching delegates." });
  }
});

app.get("/delegates/:placeName", async (req, res) => {
  try {
    const placeName = decodeURIComponent(req.params.placeName || "").trim();
    if (!placeName) return res.status(200).json([]);

    const delegates = await DelegateModel.find({ place: placeName }).sort({ fee: 1, createdAt: -1 });
    return res.status(200).json(delegates);
  } catch (err) {
    console.error("Error fetching delegates:", err);
    return res.status(500).json({ message: "Error fetching delegates." });
  }
});

app.post("/addDelegate", async (req, res) => {
  try {
    const { name, phone, fee, place, email, adminFlag, avatar } = req.body;

    let isAdmin = false;

    if (email) {
      const adminUser = await UserModel.findOne({ email });
      isAdmin = !!adminUser && adminUser.adminFlag === "Y";
    } else if (adminFlag) {
      isAdmin = adminFlag === "Y";
    }

    if (!isAdmin) return res.status(403).json({ message: "Admin only." });

    if (!name || !String(name).trim())
      return res.status(400).json({ message: "Name is required." });

    if (!phone || !String(phone).trim())
      return res.status(400).json({ message: "Phone is required." });

    if (fee === undefined || fee === null || String(fee).trim() === "")
      return res.status(400).json({ message: "Fee is required." });

    if (!place || !String(place).trim())
      return res.status(400).json({ message: "Place is required." });

    const placeExists = await PlaceModel.findOne({ name: String(place).trim() });
    if (!placeExists) return res.status(404).json({ message: "Place not found." });

    const newDelegate = new DelegateModel({
      name: String(name).trim(),
      phone: String(phone).trim(),
      fee: Number(fee),
      place: String(place).trim(),
      avatar: avatar || "",
    });

    await newDelegate.save();

    const delegates = await DelegateModel.find().sort({ name: 1 });
    return res.status(200).json({ message: "Delegate added successfully.", delegates });
  } catch (err) {
    console.error("Error adding delegate:", err);
    return res.status(500).json({ message: "Error adding delegate." });
  }
});

app.put("/admin/delegate/:id", async (req, res) => {
  try {
    const { email, name, phone, fee, place } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required." });

    const adminUser = await UserModel.findOne({ email });
    if (!adminUser || adminUser.adminFlag !== "Y") {
      return res.status(403).json({ message: "Admin only." });
    }

    if (!name || !String(name).trim())
      return res.status(400).json({ message: "Name is required." });

    if (!phone || !String(phone).trim())
      return res.status(400).json({ message: "Phone is required." });

    if (fee === undefined || fee === null || String(fee).trim() === "")
      return res.status(400).json({ message: "Fee is required." });

    if (!place || !String(place).trim())
      return res.status(400).json({ message: "Place is required." });

    const delegate = await DelegateModel.findById(req.params.id);
    if (!delegate) return res.status(404).json({ message: "Delegate not found." });

    delegate.name = String(name).trim();
    delegate.phone = String(phone).trim();
    delegate.fee = Number(fee);
    delegate.place = String(place).trim();

    await delegate.save();

    return res.status(200).json({ message: "Updated", delegate });
  } catch (err) {
    console.error("Error updating delegate:", err);
    return res.status(500).json({ message: "Error updating delegate." });
  }
});

app.delete("/admin/delegate/:id", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required." });

    const adminUser = await UserModel.findOne({ email });
    if (!adminUser || adminUser.adminFlag !== "Y") {
      return res.status(403).json({ message: "Admin only." });
    }

    const delegate = await DelegateModel.findById(req.params.id);
    if (!delegate) return res.status(404).json({ message: "Delegate not found." });

    await DelegateModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Deleted" });
  } catch (err) {
    console.error("Error deleting delegate:", err);
    return res.status(500).json({ message: "Error deleting delegate." });
  }
});

app.get("/", (req, res) => {
  res.send("OnTheWay API is running ✅");
});
