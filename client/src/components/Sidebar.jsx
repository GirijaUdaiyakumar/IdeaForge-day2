import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <h1 className="logo">
        IdeaForge
      </h1>

      <nav>

        <NavLink to="/dashboard">
          Dashboard
        </NavLink>

        <NavLink to="/ideas">
          My Ideas
        </NavLink>

        <NavLink to="/profile">
          Profile
        </NavLink>

      </nav>

    </aside>
  );
}