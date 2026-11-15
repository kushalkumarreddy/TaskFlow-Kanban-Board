
import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero-section" id="home">

      <div className="container">
        <div className="row align-items-center min-vh-75">

          {/* Hero Content */}
          <div className="col-lg-6 py-5">

            <span className="hero-badge">
              <i className="bi bi-stars me-2"></i>
              Your productivity workspace
            </span>

            <h1 className="hero-title mt-4">
              Work Smarter.
              <br />
              Stay <span>Organized.</span>
              <br />
              Achieve More.
            </h1>

            <p className="hero-description mt-4">
              Manage your tasks, organize your projects and
              track your productivity with a workspace
              designed to keep everything moving.
            </p>

            {/* Hero Buttons */}
            <div className="d-flex flex-wrap gap-3 mt-4">

              <Link
                to="/register"
                className="btn btn-primary btn-lg hero-btn"
              >
                Get Started
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>

              <a
                href="#features"
                className="btn btn-outline-light btn-lg hero-outline-btn"
              >
                Explore Features
              </a>

            </div>

            {/* Trust Indicators */}
            <div className="hero-trust mt-5">

              <div>
                <i className="bi bi-check-circle-fill me-2"></i>
                Simple to use
              </div>

              <div>
                <i className="bi bi-check-circle-fill me-2"></i>
                Organized workflow
              </div>

            </div>

          </div>

          {/* Dashboard Preview */}
          <div className="col-lg-6 py-5">

            <div className="hero-visual">

              <div className="hero-floating-card floating-one">
                <i className="bi bi-check-circle-fill text-success"></i>
                Task completed!
              </div>

              <div className="hero-dashboard">

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <div>
                    <h5 className="fw-bold mb-1">
                      My Workspace
                    </h5>

                    <small className="text-secondary">
                      Your productivity overview
                    </small>
                  </div>

                  <i className="bi bi-grid-fill text-primary fs-4"></i>

                </div>

                {/* Preview Statistics */}
                <div className="row g-3 mb-4">

                  <div className="col-6">
                    <div className="preview-stat">

                      <i className="bi bi-list-task text-primary"></i>

                      <h3>Tasks</h3>

                      <p>Stay organized</p>

                    </div>
                  </div>

                  <div className="col-6">
                    <div className="preview-stat">

                      <i className="bi bi-check2-circle text-success"></i>

                      <h3>Progress</h3>

                      <p>Track your work</p>

                    </div>
                  </div>

                </div>

                {/* Kanban Preview */}
                <h6 className="fw-bold mb-3">
                  Project Board
                </h6>

                <div className="preview-board">

                  <div className="preview-column">
                    <span className="preview-dot bg-primary"></span>
                    To Do

                    <div className="preview-task"></div>
                    <div className="preview-task"></div>
                  </div>

                  <div className="preview-column">
                    <span className="preview-dot bg-warning"></span>
                    In Progress

                    <div className="preview-task"></div>
                  </div>

                  <div className="preview-column">
                    <span className="preview-dot bg-success"></span>
                    Completed

                    <div className="preview-task"></div>
                  </div>

                </div>

                {/* Progress Bar */}
                <div className="preview-progress mt-4">

                  <div className="d-flex justify-content-between mb-2">

                    <small>Project progress</small>

                    <small className="text-primary fw-bold">
                      Stay on track
                    </small>

                  </div>

                  <div className="progress">

                    <div
                      className="progress-bar bg-primary"
                      style={{ width: '65%' }}
                    ></div>

                  </div>

                </div>

              </div>

              <div className="hero-floating-card floating-two">
                <i className="bi bi-calendar-check text-primary"></i>
                Deadlines made easier
              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
}

export default Hero;
