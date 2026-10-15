const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
  createPost,
  getPostsByTopic,
  getAllPosts,
  deletePost,
  likePost,
  dislikePost,
  addReply,
} = require("../controllers/postController");

const { protect } = require("../middleware/authMiddleware");

// create post
router.post(
    "/",
    protect,
    upload.single("image"),
    createPost
);

// get all posts
router.get("/", getAllPosts);

// get posts by topic
router.get("/topic/:topic", getPostsByTopic);

// like a post
router.put("/:postId/like", protect, likePost);

// dislike a post
router.put("/:postId/dislike", protect, dislikePost);

// reply to a post
router.post("/:postId/reply", protect, addReply);

// delete own post
router.delete("/:postId", protect, deletePost);

module.exports = router;