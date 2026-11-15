
import React from 'react';

import { Link } from 'react-router-dom';

function ComingSoonPage({ title }) {

  return (

    <div className="coming-soon-page">

      <div className="coming-soon-card text-center">

        <div className="coming-soon-icon">
          <i className="bi bi-hourglass-split"></i>
        </div>

        <h3 className="fw-bold mt-4">
          {title}
        </h3>

        <p className="text-secondary mt-2">
          This section will be implemented in an upcoming
          development phase.
        </p>

        <Link
          to="/dashboard"
          className="btn btn-primary mt-3 px-4"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Dashboard
        </Link>

      </div>

    </div>

  );

}

export default ComingSoonPage;
