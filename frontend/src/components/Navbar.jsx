import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">
          ThreadRoom
        </Link>
      </div>

      <div className="nav-right">
        <Link to="/">Home</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;