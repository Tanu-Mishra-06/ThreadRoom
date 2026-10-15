function Sidebar({
  topics,
  selectedTopic,
  setSelectedTopic,
 user,
  onLogout,
  onProfileClick,
}) {
  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-top">
          <h2 className="sidebar-logo">ThreadRoom</h2>
          <p className="sidebar-user">
            Logged in as <span>@{user?.username || "student"}</span>
          </p>
        </div>

        <div className="sidebar-actions">
          <button className="profile-btn" onClick={onProfileClick}>
            My Profile
          </button>
        </div>

        <div className="sidebar-section">
          <h3>Topics</h3>
          <ul className="topic-list">
            {topics.map((topic) => (
              <li
                key={topic.name}
                className={
                  selectedTopic.name === topic.name ? "active-topic" : ""
                }
                onClick={() => setSelectedTopic(topic)}
              >
                {topic.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;