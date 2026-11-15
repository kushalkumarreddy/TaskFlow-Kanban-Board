
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom">
      <div className="container py-2">

        {/* Logo */}
        <Link className="navbar-brand fw-bold fs-3" to="/">
          <span className="text-primary">Task</span>Flow
          <i className="bi bi-check2-square ms-2 text-primary"></i>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#taskNavbar"
          aria-controls="taskNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="taskNavbar">

          <ul className="navbar-nav mx-auto gap-lg-3">

            <li className="nav-item">
              <a className="nav-link" href="#home">
                Home
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#features">
                Features
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#how-it-works">
                How It Works
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#benefits">
                Benefits
              </a>
            </li>

          </ul>

          {/* Authentication Buttons */}
          <div className="d-flex gap-2 mt-3 mt-lg-0">

            <Link
              to="/login"
              className="btn btn-outline-primary px-4"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="btn btn-primary px-4"
            >
              Get Started
            </Link>

          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
