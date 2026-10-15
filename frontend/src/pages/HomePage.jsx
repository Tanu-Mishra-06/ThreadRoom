import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import homeBg from "../assets/home-bg.png";

function HomePage() {
  return (
    <div
      className="home-page"
      style={{ backgroundImage: `url(${homeBg})` }}
    >
      <Navbar />

      <main className="home-content">
        <section className="hero">
          <div className="hero-content-box">
            <p className="hero-tag">College discussions, without the chaos.</p>

            <h1>Welcome to ThreadRoom</h1>

            <p className="hero-subtext">
              A college-only discussion platform where students can join topics,
              ask questions, share updates, and have meaningful conversations.
              From hostel life and campus gossip to coding, placements, clubs,
              and academics — everything stays inside your campus circle.
            </p>

            <div className="hero-buttons">
              <Link to="/signup" className="primary-btn">
                Join ThreadRoom
              </Link>

              <Link to="/login" className="secondary-btn">
                Login
              </Link>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2>Why ThreadRoom?</h2>

          <div className="features-grid">
            <div className="feature-card">
              <h3>Topic-based discussions</h3>
              <p>
                Join conversations around coding, academics, hackathons,
                internships, hostel life, clubs, events, and more.
              </p>
            </div>

            <div className="feature-card">
              <h3>Built for college students</h3>
              <p>
                A focused space for your campus community — ask doubts, share
                resources, and find the right people faster.
              </p>
            </div>

            <div className="feature-card">
              <h3>Ask, share, connect</h3>
              <p>
                Start discussions, post updates, and participate in threads
                with students who actually get the context.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;