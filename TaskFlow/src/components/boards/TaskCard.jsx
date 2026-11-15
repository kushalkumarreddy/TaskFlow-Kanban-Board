
function TaskCard({ task, onEdit, onDelete, onDragStart }) {
  const priorityClass = {
    Low: 'priority-low',
    Medium: 'priority-medium',
    High: 'priority-high'
  };

  const isOverdue =
    task.dueDate &&
    task.status !== 'Completed' &&
    new Date(`${task.dueDate}T23:59:59`) < new Date();

  const formattedDate = task.dueDate
    ? new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(
        'en-IN',
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }
      )
    : null;

  return (
    <div
      className="card task-card border-0 mb-3"
      draggable="true"
      onDragStart={(event) => onDragStart(event, task)}
    >
      <div className="card-body p-3">

        <div className="d-flex justify-content-between align-items-start gap-2">
          <h6 className="fw-semibold task-card-title mb-2">
            {task.title}
          </h6>

          <div className="dropdown flex-shrink-0">
            <button
              className="btn btn-sm task-menu-button"
              type="button"
              data-bs-toggle="dropdown"
              aria-label="Task actions"
            >
              <i className="bi bi-three-dots" />
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => onEdit(task)}
                >
                  <i className="bi bi-pencil me-2" />
                  Edit task
                </button>
              </li>

              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={() => onDelete(task)}
                >
                  <i className="bi bi-trash me-2" />
                  Delete task
                </button>
              </li>
            </ul>
          </div>
        </div>

        {task.description && (
          <p className="text-secondary small task-description mb-3">
            {task.description}
          </p>
        )}

        <div className="d-flex flex-wrap gap-2 mb-3">
          <span
            className={`priority-badge ${
              priorityClass[task.priority] || 'priority-medium'
            }`}
          >
            {task.priority || 'Medium'}
          </span>

          {task.category && (
            <span className="task-category-badge">
              {task.category}
            </span>
          )}
        </div>

        {formattedDate && (
          <div
            className={`task-due-date ${
              isOverdue ? 'task-overdue' : ''
            }`}
          >
            <i className="bi bi-calendar3 me-2" />
            {formattedDate}

            {isOverdue && (
              <span className="ms-1 fw-semibold">
                (Overdue)
              </span>
            )}
          </div>
        )}

        <div className="text-end mt-2">
          <i
            className="bi bi-grip-vertical text-secondary"
            title="Drag to move task"
          />
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
