
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Sidebar({ mobile = false, onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'bi-grid' },
    { name: 'My Boards', path: '/boards', icon: 'bi-kanban' },
    { name: 'All Tasks', path: '/tasks', icon: 'bi-list-check' },
    { name: 'Calendar', path: '/calendar', icon: 'bi-calendar3' },
    { name: 'Activity History', path: '/activity', icon: 'bi-clock-history' },
    { name: 'Settings', path: '/settings', icon: 'bi-gear' }
  ];

  const handleLogout = () => {
    logout();

    if (onNavigate) {
      onNavigate();
    }

    navigate('/login', { replace: true });
  };

  return (
    <div className="sidebar-content d-flex flex-column h-100">

      {/* Logo */}
      <div className="sidebar-brand">
        <NavLink to="/dashboard" className="text-decoration-none">
          <i className="bi bi-check2-square text-primary me-2" />
          <span className="text-primary">Task</span>
          <span className="text-dark">Flow</span>
        </NavLink>
      </div>

      {/* Navigation */}
      <div className="sidebar-menu flex-grow-1">
        <small className="sidebar-label">WORKSPACE</small>

        <ul className="nav flex-column mt-3">
          {menuItems.map((item) => (
            <li className="nav-item mb-2" key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/boards'}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <i className={`bi ${item.icon}`} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* User Profile */}
      <div className="sidebar-user">
        <div className="d-flex align-items-center gap-2">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="flex-grow-1 overflow-hidden">
            <h6 className="mb-0 text-truncate">
              {user?.name || 'User'}
            </h6>

            <small className="text-secondary text-truncate d-block">
              {user?.email || 'No email'}
            </small>
          </div>
        </div>

        <button
          className="btn btn-outline-danger btn-sm w-100 mt-3"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right me-2" />
          Logout
        </button>
      </div>

    </div>
  );
}

export default Sidebar;
