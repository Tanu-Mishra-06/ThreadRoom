import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function PostDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const post = location.state?.post;
  const user = location.state?.user;

  const [likes, setLikes] = useState(post?.likes || 0);
  const [dislikes, setDislikes] = useState(post?.dislikes || 0);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(post?.replies || []);

  if (!post) {
    return (
      <div className="post-detail-page">
        <div className="post-detail-container">
          <h2>Post not found</h2>
          <button className="primary-btn" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleReplySubmit = (e) => {
    e.preventDefault();

    if (!replyText.trim()) return;

    const newReply = {
      id: Date.now(),
      author: user?.username || "student",
      text: replyText.trim(),
    };

    setReplies((prev) => [...prev, newReply]);
    setReplyText("");
  };

  return (
    <div className="post-detail-page">
      <div className="post-detail-container">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>

        <div className="detail-post-card">
          <span className="post-topic">{post.topic}</span>
          <h1>{post.title}</h1>
          <p className="post-meta">Posted by @{post.author}</p>
          <p className="detail-post-content">{post.content}</p>

          {post.image && (
            <img src={post.image} alt="post" className="detail-post-image" />
          )}

          <div className="detail-actions">
            <button className="action-btn" onClick={() => setLikes(likes + 1)}>
              👍 {likes}
            </button>
            <button
              className="action-btn"
              onClick={() => setDislikes(dislikes + 1)}
            >
              👎 {dislikes}
            </button>
          </div>
        </div>

        <div className="reply-section">
          <h2>Replies</h2>

          <form className="reply-form" onSubmit={handleReplySubmit}>
            <textarea
              rows="4"
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button type="submit" className="primary-btn">
              Reply
            </button>
          </form>

          <div className="replies-list">
            {replies.length > 0 ? (
              replies.map((reply) => (
                <div className="reply-card" key={reply.id}>
                  <p className="reply-author">@{reply.author}</p>
                  <p>{reply.text}</p>
                </div>
              ))
            ) : (
              <div className="empty-posts">
                <h3>No replies yet</h3>
                <p>Start the discussion.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;