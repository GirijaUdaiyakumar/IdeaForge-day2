import { NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import useAuth from '../hooks/useAuth';

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">IdeaForge</div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/ideas">My Ideas</NavLink>
        <NavLink to="/ideas/new">Generate Idea</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>
      <div className="sidebar-actions">
        <ThemeToggle />
        <button className="button button-secondary" onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
}
