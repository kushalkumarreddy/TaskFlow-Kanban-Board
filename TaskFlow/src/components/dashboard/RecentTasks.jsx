
import React from 'react';

import { Link } from 'react-router-dom';

import { formatDateTime } from '../../utils/dateUtils';

function RecentTasks({ tasks }) {

  const getStatusClass = (status) => {

    switch (status) {

      case 'To Do':
        return 'status-todo';

      case 'In Progress':
        return 'status-progress';

      case 'Review':
        return 'status-review';

      case 'Completed':
        return 'status-completed';

      default:
        return 'status-default';

    }

  };

  return (

    <div className="dashboard-panel h-100">

      <div className="panel-header">

        <div>
          <h5 className="fw-bold mb-1">
            Recent Tasks
          </h5>

          <p className="text-secondary small mb-0">
            Your recently updated tasks
          </p>
        </div>

        <Link
          to="/tasks"
          className="btn btn-sm btn-outline-primary"
        >
          View All
        </Link>

      </div>

      <div className="recent-task-list">

        {tasks.length === 0 ? (

          <div className="dashboard-empty">

            <i className="bi bi-inbox"></i>

            <h6>No tasks yet</h6>

            <p>
              Your recent tasks will appear here.
            </p>

          </div>

        ) : (

          tasks.map((task) => (

            <div className="recent-task-item" key={task.id}>

              <div className="recent-task-info">

                <h6 className="mb-1">
                  {task.title}
                </h6>

                <small className="text-secondary">
                  {task.category || 'Uncategorized'}
                </small>

              </div>

              <div className="recent-task-meta">

                <span className={`task-status ${getStatusClass(task.status)}`}>
                  {task.status}
                </span>

                <small className="text-secondary d-block mt-2">
                  {formatDateTime(task.updatedAt || task.createdAt)}
                </small>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default RecentTasks;
