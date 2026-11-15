
import TaskCard from './TaskCard';

function KanbanColumn({
  status,
  tasks,
  onEdit,
  onDelete,
  onDragStart,
  onDropTask,
  onDragOver
}) {
  const statusColors = {
    'To Do': 'kanban-todo',
    'In Progress': 'kanban-progress',
    'Review': 'kanban-review',
    'Completed': 'kanban-completed'
  };

  return (
    <div
      className={`kanban-column ${statusColors[status] || ''}`}
      onDragOver={onDragOver}
      onDrop={(event) => onDropTask(event, status)}
    >
      <div className="kanban-column-header d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <span className="kanban-status-dot" />
          <h6 className="fw-bold mb-0">{status}</h6>
        </div>

        <span className="kanban-count">
          {tasks.length}
        </span>
      </div>

      <div className="kanban-task-list">
        {tasks.length === 0 ? (
          <div className="kanban-empty">
            <i className="bi bi-inbox fs-3 d-block mb-2" />
            <span>No tasks yet</span>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default KanbanColumn;
