import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import CreatePostModal from "../components/CreatePostModal";
import PostDetailModal from "../components/PostDetailModal";
import dashboardBg from "../assets/dashboard-bg.png";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

function DashboardPage() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const replaceUpdatedPost = (updatedPost) => {
  setAllPosts((prev) =>
    prev.map((post) =>
      post._id === updatedPost._id ? updatedPost : post
    )
  );

  setSelectedPost((prev) =>
    prev && prev._id === updatedPost._id ? updatedPost : prev
  );
};

  const topics = [
    {
      name: "DSA",
      description:
        "Discuss coding problems, interview prep, and data structures.",
    },
    {
      name: "Web Development",
      description:
        "Frontend, backend, MERN stack, React, Node, APIs and more.",
    },
    {
      name: "Hackathons",
      description:
        "Find teammates, share ideas, and talk about hackathon builds.",
    },
    {
      name: "Internships",
      description:
        "Talk about opportunities, resumes, referrals, and preparation.",
    },
    {
      name: "Hostel & Mess",
      description:
        "Daily campus life, hostel chaos, food reviews, and survival tips.",
    },
    {
      name: "College Events",
      description:
        "Fest updates, club activities, workshops, and event discussions.",
    },
    {
      name: "Placements",
      description:
        "Prep strategy, company rounds, OA experience, and placement talk.",
    },
    {
      name: "General Discussion",
      description: "Anything college-related that doesn’t fit elsewhere.",
    },
  ];

  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [allPosts, setAllPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchAllPosts = async () => {
    try {
      setLoadingPosts(true);

      const response = await fetch(`${API_BASE}/posts`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch posts");
      }

      setAllPosts(data);
    } catch (error) {
      console.error("Fetch posts error:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
      return;
    }

    fetchAllPosts();
  }, []);

  const postsForSelectedTopic = useMemo(() => {
    return allPosts.filter((post) => post.topic === selectedTopic.name);
  }, [allPosts, selectedTopic]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleOpenProfile = () => {
    navigate("/profile");
  };

  const handleCreatePost = async ({ title, content, topic, image }) => {
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);
      formData.append("topic", topic);

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      setAllPosts((prev) => [data.post, ...prev]);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Create post error:", error);
      alert(error.message || "Could not create post");
    }
  };

  const handleLikePost = async (post) => {
    try {
      const response = await fetch(`${API_BASE}/posts/${post._id}/like`, {
        method: "PUT",
        headers: authHeaders,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to like post");
      }

      replaceUpdatedPost(data.post);
    } catch (error) {
      console.error("Like post error:", error);
      alert(error.message || "Could not like post");
    }
  };

  const handleDislikePost = async (post) => {
    try {
      const response = await fetch(`${API_BASE}/posts/${post._id}/dislike`, {
        method: "PUT",
        headers: authHeaders,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to dislike post");
      }

      replaceUpdatedPost(data.post);
    } catch (error) {
      console.error("Dislike post error:", error);
      alert(error.message || "Could not dislike post");
    }
  };

  const handleReplyPost = async (postId, replyText) => {
    try {
      const response = await fetch(`${API_BASE}/posts/${postId}/reply`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ text: replyText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add reply");
      }

      replaceUpdatedPost(data.post);
    } catch (error) {
      console.error("Reply post error:", error);
      alert(error.message || "Could not add reply");
    }
  };

  const handleDeletePost = async (post) => {
    const confirmed = window.confirm("Delete this post?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE}/posts/${post._id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete post");
      }

      setAllPosts((prev) => prev.filter((p) => p._id !== post._id));

      if (selectedPost?._id === post._id) {
        setSelectedPost(null);
      }
    } catch (error) {
      console.error("Delete post error:", error);
      alert(error.message || "Could not delete post");
    }
  };

  const handleOpenPost = (post) => {
    setSelectedPost(post);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
  };

  return (
    <div
      className="dashboard-page"
      style={{ backgroundImage: `url(${dashboardBg})` }}
    >
      <div className="dashboard-overlay">
        <Sidebar
          topics={topics}
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
          user={user}
          onLogout={handleLogout}
          onProfileClick={handleOpenProfile}
        />

        <Feed
          selectedTopic={selectedTopic}
          posts={postsForSelectedTopic}
          user={user}
          onCreatePostClick={() => setShowCreateModal(true)}
          onOpenPost={handleOpenPost}
          onDeletePost={handleDeletePost}
        />
      </div>

      {loadingPosts && (
        <div className="modal-backdrop">
          <div className="create-post-modal">
            <h2 style={{ color: "white" }}>Loading posts...</h2>
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreatePostModal
          selectedTopic={selectedTopic}
          onClose={() => setShowCreateModal(false)}
          onCreatePost={handleCreatePost}
        />
      )}

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          currentUser={user}
          onClose={handleClosePost}
          onLike={handleLikePost}
          onDislike={handleDislikePost}
          onReply={handleReplyPost}
          onDelete={handleDeletePost}
        />
      )}
    </div>
  );
}

export default DashboardPage;