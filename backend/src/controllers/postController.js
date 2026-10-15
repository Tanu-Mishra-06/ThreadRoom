const Post = require("../models/Post");
const { uploadToCloudinary } = require("../config/cloudinary");



const createPost = async (req, res) => {
  try {
    const { title, content, topic } = req.body;

    if (!title || !content || !topic) {
      return res
        .status(400)
        .json({ message: "Title, content and topic are required" });
    }

    let image = "";

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      image = uploadedImage.secure_url;
    }

    const post = await Post.create({
      title,
      content,
      topic,
      image: image || "",
      author: req.user._id,
    });

    const populatedPost = await Post.findById(post._id)
      .populate("author", "fullName username email")
      .populate("replies.author", "fullName username");

    res.status(201).json({
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error while creating post" });
  }
};

const getPostsByTopic = async (req, res) => {
  try {
    const { topic } = req.params;

    const posts = await Post.find({ topic })
      .populate("author", "fullName username")
      .populate("replies.author", "fullName username")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ message: "Server error while fetching posts" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "fullName username")
      .populate("replies.author", "fullName username")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Get all posts error:", error);
    res.status(500).json({ message: "Server error while fetching all posts" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can delete only your own posts" });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Server error while deleting post" });
  }
};

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id.toString();

    const post = await Post.findById(postId)
      .populate("author", "fullName username")
      .populate("replies.author", "fullName username");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userId);
    }

    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("author", "fullName username")
      .populate("replies.author", "fullName username");

    res.status(200).json({
      message: alreadyLiked ? "Like removed" : "Post liked",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({ message: "Server error while liking post" });
  }
};

const dislikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id.toString();

    const post = await Post.findById(postId)
      .populate("author", "fullName username")
      .populate("replies.author", "fullName username");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyDisliked = post.dislikes.some(
      (id) => id.toString() === userId
    );

    if (alreadyDisliked) {
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userId);
    } else {
      post.dislikes.push(userId);
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    }

    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("author", "fullName username")
      .populate("replies.author", "fullName username");

    res.status(200).json({
      message: alreadyDisliked ? "Dislike removed" : "Post disliked",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Dislike post error:", error);
    res.status(500).json({ message: "Server error while disliking post" });
  }
};

const addReply = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.replies.push({
      text: text.trim(),
      author: req.user._id,
    });

    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("author", "fullName username")
      .populate("replies.author", "fullName username")
      .sort({ createdAt: -1 });

    res.status(201).json({
      message: "Reply added successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Reply error:", error);
    res.status(500).json({ message: "Server error while adding reply" });
  }
};

module.exports = {
  createPost,
  getPostsByTopic,
  getAllPosts,
  deletePost,
  likePost,
  dislikePost,
  addReply,
};