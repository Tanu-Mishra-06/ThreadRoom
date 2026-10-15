function PostCard({ post, currentUser, onOpenPost, onDeletePost }) {
  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwner = post.author?._id === currentUserId;

  const handleDelete = (e) => {
    e.stopPropagation();
    onDeletePost(post);
  };

  return (
    <article className="post-card" onClick={() => onOpenPost(post)}>
      <span className="post-topic">{post.topic}</span>
      <h3>{post.title}</h3>

      <p className="post-meta">
        Posted by @{post.author?.username || "student"} •{" "}
        {post.replies?.length || 0} replies
      </p>

      <p>{post.content}</p>

      {post.image && (
        <div className="image-preview" style={{ marginTop: "16px" }}>
          <img src={post.image} alt={post.title} />
        </div>
      )}

      <div className="post-actions">
        <button
          className="post-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpenPost(post);
          }}
        >
          Reply
        </button>

        <button
          className="post-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpenPost(post);
          }}
        >
          👍 {post.likes?.length || 0}
        </button>

        <button
          className="post-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpenPost(post);
          }}
        >
          👎 {post.dislikes?.length || 0}
        </button>

        {isOwner && (
          <button
            className="post-action-btn post-delete-btn"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
}

export default PostCard;