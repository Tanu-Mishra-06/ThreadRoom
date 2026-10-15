import { useState } from "react";

function PostDetailModal({
  post,
  currentUser,
  onClose,
  onLike,
  onDislike,
  onReply,
  onDelete,
}) {
  const [replyText, setReplyText] = useState("");

  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwner = post.author?._id === currentUserId;

  const likeCount = post.likes?.length || 0;
  const dislikeCount = post.dislikes?.length || 0;

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!replyText.trim()) return;

    await onReply(post._id, replyText.trim());
    setReplyText("");
  };

  const handleDelete = async () => {
    await onDelete(post);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="post-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <div className="post-detail-header">
            <span className="post-topic">{post.topic}</span>
            <h2>{post.title}</h2>
            <p className="post-detail-meta">
              Posted by @{post.author?.username || "student"} • {likeCount} likes
              • {dislikeCount} dislikes
            </p>
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <p className="post-detail-content">{post.content}</p>

        {post.image && (
          <img src={post.image} alt={post.title} className="post-detail-image" />
        )}

        <div className="post-reaction-row">
          <button className="reaction-btn" onClick={() => onLike(post)}>
            👍 Like ({likeCount})
          </button>

          <button className="reaction-btn" onClick={() => onDislike(post)}>
            👎 Dislike ({dislikeCount})
          </button>

          {isOwner && (
            <button
              className="reaction-btn post-delete-btn"
              onClick={handleDelete}
            >
              Delete Post
            </button>
          )}
        </div>

        <div className="reply-section">
          <h3>Replies</h3>

          <div className="reply-list">
            {post.replies?.length > 0 ? (
              post.replies.map((reply) => (
                <div key={reply._id || reply.id} className="reply-card">
                  <p className="reply-author">
                    @{reply.author?.username || "student"}
                  </p>
                  <p className="reply-text">{reply.text}</p>
                </div>
              ))
            ) : (
              <div className="empty-posts">
                <h3>No replies yet</h3>
                <p>Start the discussion.</p>
              </div>
            )}
          </div>

          <form className="reply-form" onSubmit={handleReplySubmit}>
            <textarea
              className="reply-textarea"
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />

            <div className="modal-actions">
              <button type="submit" className="create-post-btn">
                Reply
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostDetailModal;