
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 px-lg-4">
        <NavLink
          to="/admin/dashboard"
          className="navbar-brand fw-bold"
        >
          <i className="bi bi-check2-square text-primary me-2"></i>
          TaskFlow <span className="text-secondary fs-6">Admin</span>
        </NavLink>

        <div className="ms-auto d-flex align-items-center gap-3">
          <span className="text-white small d-none d-sm-inline">
            <i className="bi bi-shield-check me-1"></i>
            {user?.name}
          </span>

          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-1"></i>
            Logout
          </button>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">

          <aside className="col-lg-2 bg-white border-end min-vh-100 p-3">
            <p className="text-secondary small fw-semibold mt-3 mb-2">
              ADMINISTRATION
            </p>

            <nav className="nav flex-column gap-2">
              <NavLink
                to="/admin/dashboard"
                end
                className={({ isActive }) =>
                  `nav-link rounded ${isActive ? 'active bg-primary text-white' : 'text-dark'}`
                }
              >
                <i className="bi bi-grid me-2"></i>
                Overview
              </NavLink>

              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `nav-link rounded ${isActive ? 'active bg-primary text-white' : 'text-dark'}`
                }
              >
                <i className="bi bi-people me-2"></i>
                User Management
              </NavLink>
            </nav>

            <hr />

            <NavLink
              to="/"
              className="nav-link text-secondary"
            >
              <i className="bi bi-house me-2"></i>
              View Website
            </NavLink>
          </aside>

          <main className="col-lg-10 p-3 p-lg-4">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
