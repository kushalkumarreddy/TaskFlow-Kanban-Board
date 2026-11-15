import React from 'react';

function Footer() {
  return (
    <footer className="footer-section">

      <div className="container py-5">

        <div className="row g-4">

          <div className="col-lg-5">

            <h4 className="fw-bold text-white">
              <i className="bi bi-check2-square text-primary me-2"></i>
              TaskFlow
            </h4>

            <p className="footer-description mt-3">
              Organize your work, track your progress
              and get things done with a simpler
              productivity workspace.
            </p>

          </div>

          <div className="col-6 col-lg-3">

            <h6 className="text-white fw-bold mb-3">
              Explore
            </h6>

            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#benefits">Benefits</a></li>
            </ul>

          </div>

          <div className="col-6 col-lg-4">

            <h6 className="text-white fw-bold mb-3">
              Get Started
            </h6>

            <ul className="footer-links">
              <li><a href="#get-started">Create Account</a></li>
              <li><a href="#get-started">Login</a></li>
              <li><a href="#features">Explore Features</a></li>
            </ul>

          </div>

        </div>

        <hr className="footer-divider my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between gap-2">

          <p className="footer-bottom mb-0">
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>

          <p className="footer-bottom mb-0">
            Organize Your Work. Track Your Progress. Get Things Done.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;