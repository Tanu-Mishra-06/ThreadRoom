import PostCard from "./PostCard";

function Feed({
  selectedTopic,
  posts,
  user,
  onCreatePostClick,
  onOpenPost,
  onDeletePost,
}) {
  return (
    <section className="feed-section">
      <div className="feed-header">
        <div>
          <p className="feed-welcome">
            Welcome back, {user?.fullName || "Student"}
          </p>
          <h2>{selectedTopic.name}</h2>
          <p className="feed-description">{selectedTopic.description}</p>
        </div>

        <button className="create-post-btn" onClick={onCreatePostClick}>
          + Create Post
        </button>
      </div>

      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={user}
              onOpenPost={onOpenPost}
              onDeletePost={onDeletePost}
            />
          ))
        ) : (
          <div className="empty-posts">
            <h3>No posts yet in {selectedTopic.name}</h3>
            <p>Be the first one to start the discussion.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Feed;