const User = require("../models/User");
const { uploadToCloudinary } = require("../config/cloudinary");

const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if username is already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({
        username: username.trim(),
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Username already taken",
        });
      }

      user.username = username.trim();
    }

    // Update bio
    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    // Upload new profile picture
    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      user.profilePicture = uploadedImage.secure_url;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: "Server error while updating profile",
    });
  }
};

module.exports = {
  updateProfile,
};