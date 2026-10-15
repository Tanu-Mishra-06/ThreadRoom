const express = require("express");
const router = express.Router();

const { updateProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.put(
  "/profile",
  protect,
  upload.single("profilePicture"),
  updateProfile
);

module.exports = router;