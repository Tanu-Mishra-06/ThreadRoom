import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { loginUser } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(formData);

      // token + user save
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // login success -> dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-page">
        <div className="auth-card">
          <h2>Login to ThreadRoom</h2>
          <p className="auth-subtext">
            Continue your discussions, topics, and college conversations.
          </p>

          <form className="auth-form" onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <button type="submit" className="primary-btn auth-btn">
              Login
            </button>
          </form>

          {error && <p style={{ color: "tomato", marginTop: "12px" }}>{error}</p>}

          <p className="auth-footer">
            Don’t have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;