
import { Link } from 'react-router-dom';

function BoardCard({ board, taskCount, onEdit, onDelete }) {
  return (
    <div className="card board-card h-100 border-0">
      <div
        className="board-card-accent"
        style={{ backgroundColor: board.color || '#315EFB' }}
      />

      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div
            className="board-icon"
            style={{
              backgroundColor: `${board.color || '#315EFB'}18`,
              color: board.color || '#315EFB'
            }}
          >
            <i className="bi bi-kanban-fill" />
          </div>

          <div className="dropdown">
            <button
              className="btn btn-sm btn-light border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-label="Board actions"
            >
              <i className="bi bi-three-dots-vertical" />
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => onEdit(board)}
                >
                  <i className="bi bi-pencil me-2" />
                  Edit board
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={() => onDelete(board)}
                >
                  <i className="bi bi-trash me-2" />
                  Delete board
                </button>
              </li>
            </ul>
          </div>
        </div>

        <Link
          to={`/boards/${board.id}`}
          className="text-decoration-none text-dark"
        >
          <h5 className="fw-bold mb-2 board-card-title">
            {board.name}
          </h5>
        </Link>

        <p className="text-secondary small board-card-description mb-4">
          {board.description || 'No description added.'}
        </p>

        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
          <span className="text-secondary small">
            <i className="bi bi-list-task me-2" />
            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
          </span>

          <Link
            to={`/boards/${board.id}`}
            className="btn btn-sm btn-outline-primary"
          >
            Open board <i className="bi bi-arrow-right ms-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BoardCard;
