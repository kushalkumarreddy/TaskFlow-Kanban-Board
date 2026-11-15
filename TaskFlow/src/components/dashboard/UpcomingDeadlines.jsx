
import React from 'react';

import { Link } from 'react-router-dom';

import {
  formatDate,
  isTaskOverdue
} from '../../utils/dateUtils';

function UpcomingDeadlines({ tasks }) {

  return (

    <div className="dashboard-panel h-100">

      <div className="panel-header">

        <div>
          <h5 className="fw-bold mb-1">
            Upcoming Deadlines
          </h5>

          <p className="text-secondary small mb-0">
            Tasks due within seven days
          </p>
        </div>

        <i className="bi bi-calendar-event text-primary fs-4"></i>

      </div>

      <div className="deadline-list">

        {tasks.length === 0 ? (

          <div className="dashboard-empty">

            <i className="bi bi-calendar-check"></i>

            <h6>No upcoming deadlines</h6>

            <p>
              You have no tasks due in the next seven days.
            </p>

          </div>

        ) : (

          tasks.map((task) => {

            const overdue = isTaskOverdue(task);

            return (

              <div className="deadline-item" key={task.id}>

                <div className="deadline-date">

                  <i className={`bi ${
                    overdue
                      ? 'bi-exclamation-circle text-danger'
                      : 'bi-calendar3 text-primary'
                  }`}></i>

                </div>

                <div className="flex-grow-1">

                  <h6 className="mb-1">
                    {task.title}
                  </h6>

                  <small className="text-secondary">
                    {formatDate(task.dueDate)}
                  </small>

                </div>

                <span className={`deadline-badge ${
                  overdue ? 'deadline-overdue' : 'deadline-upcoming'
                }`}>

                  {overdue ? 'Overdue' : 'Upcoming'}

                </span>

              </div>

            );

          })

        )}

      </div>

      <Link
        to="/calendar"
        className="btn btn-light w-100 mt-3"
      >
        View Calendar
        <i className="bi bi-arrow-right ms-2"></i>
      </Link>

    </div>

  );

}

export default UpcomingDeadlines;
