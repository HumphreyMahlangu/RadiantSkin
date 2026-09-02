import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const isActive = (path: string) =>
    location.pathname === path ? "active" : "";

  return (
    <nav className="navbar">
      <div className="logo">RadiantSkin</div>
      <ul className="nav-links">
        <li>
          <Link to="/" className={isActive("/")}>
            Home
          </Link>
        </li>
        <li>
          <a href="/about">About Us</a>
        </li>
      </ul>
      <div className="nav-cta">
        <Link to="/login" className="btn btn-outline">
          Login
        </Link>
        <Link to="/register" className="btn btn-primary">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
