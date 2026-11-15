
import React from 'react';

function StatCard({
  title,
  value,
  icon,
  color,
  description
}) {

  return (

    <div className="col-6 col-xl-4">

      <div className="stat-card h-100">

        <div className="d-flex justify-content-between align-items-start">

          <div>

            <p className="stat-title">
              {title}
            </p>

            <h3 className="stat-value">
              {value}
            </h3>

          </div>

          <div className={`stat-icon ${color}`}>
            <i className={`bi ${icon}`}></i>
          </div>

        </div>

        <p className="stat-description mb-0">
          {description}
        </p>

      </div>

    </div>

  );

}

export default StatCard;
