import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="nav-bar">
      <div className="nav-brand">IdeaForge</div>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/ideas">Ideas</Link>
        <Link to="/ideas/new">Add Idea</Link>
      </div>
    </nav>
  );
}

export default NavBar;
