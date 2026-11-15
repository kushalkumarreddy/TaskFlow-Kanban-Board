
import React from 'react';
import { useLocation } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import GlobalSearch from './GlobalSearch';
import Notifications from './Notifications';

function Topbar({ onMenuClick }) {
  const location = useLocation();
  const { user } = useAuth();

  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/boards': 'My Boards',
    '/tasks': 'All Tasks',
    '/calendar': 'Calendar',
    '/activity': 'Activity History',
    '/settings': 'Settings'
  };

  const currentTitle =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith('/boards/')
      ? 'Board Details'
      : 'TaskFlow');

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="app-topbar">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-light sidebar-toggle d-lg-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileSidebar"
          aria-controls="mobileSidebar"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <i className="bi bi-list fs-4" />
        </button>

        <div>
          <h5 className="mb-0 fw-bold">
            {currentTitle}
          </h5>

          <small className="text-secondary">
            Welcome to your TaskFlow workspace
          </small>
        </div>
      </div>

      <div className="topbar-actions">
        <div className="topbar-search d-none d-md-block">
          <GlobalSearch />
        </div>

        <Notifications />

        <div className="topbar-date d-none d-xl-block">
          <i className="bi bi-calendar3 me-2 text-primary" />
          {currentDate}
        </div>

        <div className="topbar-profile">
          <div className="topbar-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="d-none d-lg-block">
            <h6 className="mb-0">
              {user?.name || 'User'}
            </h6>

            <small className="text-secondary">
              Workspace Member
            </small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
