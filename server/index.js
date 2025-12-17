
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

    app.listen(5000, () => {
      console.log("Server connected at port number 5000..");
    });
  } catch (error) {
    console.log("Database connection error.." + error);
  }
};

startServer();


const checkAdmin = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required for admin check." });
    }

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.adminFlag !== "Y") {
      return res
        .status(403)
        .json({ message: "Not authorized. Admins only." });
    }

    next();
  } catch (err) {
    console.error("Admin check error:", err);
    res.status(500).json({ message: "Server error in admin check." });
  }
};


app.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      const pwd_match = await bcrypt.compare(req.body.password, user.password);
      if (pwd_match)
        res.status(200).json({ user: user, message: "Success" });
      else res.status(200).json({ message: "Invalid Credentials.." });
    } else {
      res.status(404).json({ message: "User not found..." });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/register", async (req, res) => {
  try {
    const { uname, email, password, profilepic } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      const new_user = new UserModel({
        uname: uname,
        email: email,
        password: hash_password,
        profilepic: profilepic,
      });
      await new_user.save();
      res.status(200).json({ message: "Success" });
    } else {
      res.status(500).json({ message: "User already exists..." });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/user/profile", async (req, res) => {
  try {
    const { currentEmail, uname, email, phone, pic } = req.body;

    if (!currentEmail) {
      return res
        .status(400)
        .json({ message: "Current email is required." });
    }

    const user = await UserModel.findOne({ email: currentEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (email && email !== currentEmail) {
      const existing = await UserModel.findOne({ email });
      if (existing) {
        return res
          .status(400)
          .json({
            message: "This email is already in use by another account.",
          });
      }
      user.email = email;
    }

    if (uname !== undefined) user.uname = uname;
    if (phone !== undefined) user.phone = phone;
    if (pic !== undefined) user.profilepic = pic;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Error updating profile." });
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
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Error changing password." });
  }
});


app.post("/admin/place", checkAdmin, async (req, res) => {
  try {
    const { name, city } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Place name is required." });
    }

    const existing = await PlaceModel.findOne({ name });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Place with this name already exists." });
    }

    const place = new PlaceModel({ name, city, isActive: true });
    await place.save();

    res.status(201).json({ message: "Place created successfully.", place });
  } catch (err) {
    console.error("Error creating place:", err);
    res.status(500).json({ message: "Error creating place." });
  }
});

app.put("/admin/place/:placeId", checkAdmin, async (req, res) => {
  try {
    const { placeId } = req.params;
    const { name, city } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Place name is required." });
    }

    const existing = await PlaceModel.findOne({
      _id: { $ne: placeId },
      name: name,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Another place with this name already exists." });
    }

    const updated = await PlaceModel.findByIdAndUpdate(
      placeId,
      { name, city },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Place not found." });
    }

    res.status(200).json({
      message: "Place updated successfully.",
      place: updated,
    });
  } catch (err) {
    console.error("Error updating place:", err);
    res.status(500).json({ message: "Error updating place." });
  }
});

app.delete("/admin/place/:placeId", checkAdmin, async (req, res) => {
  try {
    const { placeId } = req.params;

    const place = await PlaceModel.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: "Place not found." });
    }

    place.isActive = false;
    await place.save();

    await DelegateModel.deleteMany({ place: place.name });

    res.status(200).json({
      message: "Place deactivated and related delegates deleted.",
      place,
    });
  } catch (err) {
    console.error("Error deleting place:", err);
    res.status(500).json({ message: "Error deleting place." });
  }
});

app.post("/admin/delegate", checkAdmin, async (req, res) => {
  try {
    const { name, phone, fee, rating, avatar, place } = req.body;

    if (!name || !phone || fee === undefined || !place) {
      return res.status(400).json({
        message: "Name, phone, fee and place are required.",
      });
    }

    const placeDoc = await PlaceModel.findOne({ name: place });
    if (!placeDoc) {
      return res.status(404).json({ message: "Place not found." });
    }

    const delegate = new DelegateModel({
      name,
      phone,
      fee: Number(fee),
      rating: rating ? Number(rating) : 4.5,
      avatar,
      place, 
    });

    await delegate.save();

    res.status(201).json({
      message: "Delegate created successfully.",
      delegate,
    });
  } catch (err) {
    console.error("Error creating delegate:", err);
    res.status(500).json({ message: "Error creating delegate." });
  }
});

app.put("/admin/delegate/:delegateId", checkAdmin, async (req, res) => {
  try {
    const { delegateId } = req.params;
    const { name, phone, fee, rating, avatar, place } = req.body;

    if (!name || !phone || fee === undefined) {
      return res.status(400).json({
        message: "Name, phone and fee are required.",
      });
    }

    const updateData = {
      name,
      phone,
      fee: Number(fee),
      rating: rating ? Number(rating) : 4.5,
      avatar,
    };

    if (place) {
      const placeDoc = await PlaceModel.findOne({ name: place });
      if (!placeDoc) {
        return res.status(404).json({ message: "Place not found." });
      }
      updateData.place = place;
    }

    const updated = await DelegateModel.findByIdAndUpdate(
      delegateId,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Delegate not found." });
    }

    res.status(200).json({
      message: "Delegate updated successfully.",
      delegate: updated,
    });
  } catch (err) {
    console.error("Error updating delegate:", err);
    res.status(500).json({ message: "Error updating delegate." });
  }
});

app.delete("/admin/delegate/:delegateId", checkAdmin, async (req, res) => {
  try {
    const { delegateId } = req.params;

    const deleted = await DelegateModel.findByIdAndDelete(delegateId);

    if (!deleted) {
      return res.status(404).json({ message: "Delegate not found." });
    }

    res.status(200).json({
      message: "Delegate deleted successfully.",
      delegate: deleted,
    });
  } catch (err) {
    console.error("Error deleting delegate:", err);
    res.status(500).json({ message: "Error deleting delegate." });
  }
});


app.get("/places", async (req, res) => {
  try {
    const places = await PlaceModel.find({ isActive: true }).sort({
      name: 1,
    });
    res.json(places);
  } catch (err) {
    console.error("Error fetching places:", err);
    res.status(500).json({ message: "Error fetching places." });
  }
});

app.get("/delegates", async (req, res) => {
  try {
    const delegates = await DelegateModel.find().sort({ name: 1 });
    res.status(200).json(delegates);
  } catch (err) {
    console.error("Error fetching delegates:", err);
    res.status(500).json({ message: "Error fetching delegates." });
  }
});

app.get("/delegates/:placeName", async (req, res) => {
  try {
    const { placeName } = req.params;

    const delegates = await DelegateModel.find({ place: placeName }).sort({
      fee: 1,
    });

    res.status(200).json(delegates);
  } catch (err) {
    console.error("Error fetching delegates:", err);
    res.status(500).json({ message: "Error fetching delegates." });
  }
});
