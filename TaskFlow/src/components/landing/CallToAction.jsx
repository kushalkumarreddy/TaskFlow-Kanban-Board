
import React from 'react';
import { Link } from 'react-router-dom';

function CallToAction() {
  return (
    <section className="cta-section py-5" id="get-started">

      <div className="container">

        <div className="cta-card text-center">

          <span className="cta-label">
            START ORGANIZING TODAY
          </span>

          <h2 className="text-white fw-bold mt-3">
            Ready to Take Control of Your Work?
          </h2>

          <p className="text-white-50 mt-3">
            Build better habits, organize your projects
            and make every day more productive.
          </p>

          {/* Registration Button */}
          <Link
            to="/register"
            className="btn btn-light btn-lg mt-3 px-5"
          >
            Create Your Account
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>

        </div>

      </div>

    </section>
  );
}

export default CallToAction;
