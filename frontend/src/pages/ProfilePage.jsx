import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ProfilePage() {
  const navigate = useNavigate();
  const API_BASE = "http://localhost:5000/api";

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(user?.profilePicture || "");
  const [saving, setSaving] = useState(false);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "TR";

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("username", username);
      formData.append("bio", bio);

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const response = await fetch(`${API_BASE}/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Profile updated successfully!");

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-overlay">
        <div className="profile-card">
          <div className="profile-top">
            <div>
              <p className="profile-tag">Your ThreadRoom profile</p>
              <h1>{user?.fullName || "Student User"}</h1>
              <p className="profile-username">@{user?.username || "student"}</p>
            </div>

            <div className="profile-avatar-container">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="profile-avatar-image"
                />
              ) : (
                <div className="profile-avatar">{initials}</div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  setProfilePicture(file);
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </div>
          </div>

          <div className="profile-info-grid">
            <div className="profile-info-box">
              <span>Full name</span>
              <p>{user?.fullName || "Not available"}</p>
            </div>

            <div className="profile-info-box">
              <span>Username</span>

              <input
                className="profile-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="profile-info-box full-width">
              <span>Email</span>
              <p>{user?.email || "Not available"}</p>
            </div>
          </div>
          <div className="profile-info-box full-width">
            <span>Bio</span>

            <textarea
              className="profile-textarea"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others a little about yourself..."
            />
          </div>

          <div className="profile-actions">
            <button className="post-action-btn" onClick={handleBack}>
              Back to dashboard
            </button>
            <button
              className="create-post-btn"
              onClick={handleSaveChanges}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              className="logout-btn profile-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;