
import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  Link,
  useParams
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { logActivity } from '../utils/activityLogger';

import {
  getBoardById
} from '../services/boardService';

import {
  getBoardTasks,
  createTask,
  updateTask,
  deleteTask
} from '../services/taskService';

import TaskFormModal from '../components/boards/TaskFormModal';
import KanbanColumn from '../components/boards/KanbanColumn';

const statuses = [
  'To Do',
  'In Progress',
  'Review',
  'Completed'
];

function BoardDetailsPage() {

  const { boardId } = useParams();
  const { user } = useAuth();

  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // =====================================
  // LOAD BOARD AND TASKS
  // =====================================

  const loadBoardData = useCallback(async () => {

    if (!user?.id || !boardId) return;

    try {

      setLoading(true);
      setError('');

      const boardData = await getBoardById(boardId);

      // Check board ownership.
      if (String(boardData.userId) !== String(user.id)) {

        setBoard(null);
        setTasks([]);

        setError(
          'Board not found or you do not have permission to view it.'
        );

        return;
      }

      const taskData = await getBoardTasks(
        boardId,
        user.id
      );

      setBoard(boardData);
      setTasks(taskData);

    } catch (err) {

      console.error('Unable to load board:', err);

      setError(
        'Unable to load this board. Please try again.'
      );

    } finally {

      setLoading(false);

    }

  }, [boardId, user?.id]);

  useEffect(() => {
    loadBoardData();
  }, [loadBoardData]);

  // =====================================
  // SEARCH TASKS
  // =====================================

  const filteredTasks = useMemo(() => {

    const search = searchTerm.trim().toLowerCase();

    if (!search) return tasks;

    return tasks.filter((task) => {

      return [
        task.title,
        task.description,
        task.category,
        task.priority
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(search)
        );

    });

  }, [tasks, searchTerm]);

  // =====================================
  // BOARD STATISTICS
  // =====================================

  const completedCount = tasks.filter(
    (task) => task.status === 'Completed'
  ).length;

  const completionRate = tasks.length
    ? Math.round(
        (completedCount / tasks.length) * 100
      )
    : 0;

  // =====================================
  // OPEN TASK MODALS
  // =====================================

  const openCreateModal = () => {

    setSelectedTask(null);
    setShowModal(true);

  };

  const openEditModal = (task) => {

    setSelectedTask(task);
    setShowModal(true);

  };

  // =====================================
  // CREATE AND UPDATE TASK
  // =====================================

  const handleSaveTask = async (formData) => {

    try {

      setSaving(true);
      setError('');

      if (selectedTask) {

        // Update existing task.
        await updateTask(selectedTask.id, {

          ...formData,

          updatedAt: new Date().toISOString()

        });

        // Log task update.
        await logActivity({

          userId: user.id,

          action: 'Task updated',

          description: `Updated task "${formData.title}".`,

          boardId: board.id,

          boardName: board.name,

          taskId: selectedTask.id,

          taskTitle: formData.title

        });

      } else {

        // Create new task.
        const newTask = await createTask({

          ...formData,

          boardId: board.id,

          userId: user.id,

          status: 'To Do',

          createdAt: new Date().toISOString(),

          updatedAt: new Date().toISOString()

        });

        // Log task creation.
        await logActivity({

          userId: user.id,

          action: 'Task created',

          description: `Created task "${formData.title}".`,

          boardId: board.id,

          boardName: board.name,

          taskId: newTask.id,

          taskTitle: formData.title

        });

      }

      // Close modal after successful operation.
      setShowModal(false);
      setSelectedTask(null);

      // Refresh board data.
      await loadBoardData();

    } catch (err) {

      console.error('Unable to save task:', err);

      setError(
        'Unable to save this task. Please try again.'
      );

    } finally {

      setSaving(false);

    }

  };

  // =====================================
  // DELETE TASK
  // =====================================

  const handleDeleteTask = async (task) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) return;

    try {

      setError('');

      // Delete task from JSON Server.
      await deleteTask(task.id);

      // Log task deletion.
      await logActivity({

        userId: user.id,

        action: 'Task deleted',

        description: `Deleted task "${task.title}".`,

        boardId: board.id,

        boardName: board.name,

        taskId: task.id,

        taskTitle: task.title

      });

      // Remove task from the interface.
      setTasks((previous) =>

        previous.filter(
          (item) =>
            String(item.id) !== String(task.id)
        )

      );

    } catch (err) {

      console.error('Unable to delete task:', err);

      setError(
        'Unable to delete this task. Please try again.'
      );

    }

  };

  // =====================================
  // DRAG AND DROP
  // =====================================

  const handleDragStart = (event, task) => {

    event.dataTransfer.setData(
      'application/json',

      JSON.stringify({

        id: task.id,

        boardId: task.boardId

      })
    );

    event.dataTransfer.effectAllowed = 'move';

  };

  const handleDragOver = (event) => {

    event.preventDefault();

    event.dataTransfer.dropEffect = 'move';

  };

  // =====================================
  // MOVE TASK BETWEEN COLUMNS
  // =====================================

  const handleDropTask = async (event, newStatus) => {

    event.preventDefault();

    try {

      const draggedData = JSON.parse(
        event.dataTransfer.getData('application/json')
      );

      // Prevent moving tasks from another board.
      if (
        String(draggedData.boardId) !== String(board.id)
      ) {
        return;
      }

      const draggedTask = tasks.find(
        (task) =>
          String(task.id) === String(draggedData.id)
      );

      if (
        !draggedTask ||
        draggedTask.status === newStatus
      ) {
        return;
      }

      // Save previous state for rollback.
      const previousTasks = tasks;

      const oldStatus = draggedTask.status;

      // Update interface immediately.
      setTasks((current) =>

        current.map((task) =>

          String(task.id) === String(draggedTask.id)

            ? {
                ...task,
                status: newStatus
              }

            : task

        )

      );

      try {

        // Update task status in JSON Server.
        await updateTask(draggedTask.id, {

          status: newStatus,

          updatedAt: new Date().toISOString()

        });

        // Log task movement.
        await logActivity({

          userId: user.id,

          action: 'Task moved',

          description:
            `Moved "${draggedTask.title}" from ${oldStatus} to ${newStatus}.`,

          boardId: board.id,

          boardName: board.name,

          taskId: draggedTask.id,

          taskTitle: draggedTask.title

        });

      } catch (err) {

        // Restore previous state if task update fails.
        setTasks(previousTasks);

        throw err;

      }

    } catch (err) {

      console.error('Unable to move task:', err);

      setError(
        'Unable to move this task. Please try again.'
      );

    }

  };

  // =====================================
  // LOADING STATE
  // =====================================

  if (loading) {

    return (

      <div className="text-center py-5">

        <div
          className="spinner-border text-primary"
          role="status"
        />

        <p className="text-secondary mt-3">
          Loading your board...
        </p>

      </div>

    );

  }

  // =====================================
  // BOARD ERROR
  // =====================================

  if (error && !board) {

    return (

      <div className="card border-0 text-center p-5">

        <i className="bi bi-exclamation-circle fs-1 text-secondary mb-3" />

        <h4 className="fw-bold">
          Board unavailable
        </h4>

        <p className="text-secondary">
          {error}
        </p>

        <div>

          <Link
            to="/boards"
            className="btn btn-primary"
          >

            <i className="bi bi-arrow-left me-2" />

            Back to My Boards

          </Link>

        </div>

      </div>

    );

  }

  if (!board) return null;

  // =====================================
  // MAIN UI
  // =====================================

  return (

    <div className="board-details-page">

      {/* Breadcrumb */}

      <div className="mb-3">

        <Link
          to="/boards"
          className="text-decoration-none text-secondary small"
        >

          <i className="bi bi-arrow-left me-2" />

          Back to My Boards

        </Link>

      </div>

      {/* Board Header */}

      <div className="card border-0 board-details-header mb-4">

        <div
          className="board-details-color"
          style={{
            backgroundColor: board.color || '#315EFB'
          }}
        />

        <div className="card-body p-4">

          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">

            <div>

              <span className="badge text-bg-light mb-2">

                <i className="bi bi-kanban me-1" />

                Project board

              </span>

              <h2 className="fw-bold mb-2">
                {board.name}
              </h2>

              <p className="text-secondary mb-0">
                {board.description || 'No description added.'}
              </p>

            </div>

            <button
              className="btn btn-primary"
              onClick={openCreateModal}
            >

              <i className="bi bi-plus-lg me-2" />

              Add task

            </button>

          </div>

          {/* Statistics */}

          <div className="row g-3 mt-3">

            <div className="col-6 col-md-3">

              <div className="board-metric">

                <span>Total tasks</span>

                <h4>{tasks.length}</h4>

              </div>

            </div>

            <div className="col-6 col-md-3">

              <div className="board-metric">

                <span>Completed</span>

                <h4>{completedCount}</h4>

              </div>

            </div>

            <div className="col-6 col-md-3">

              <div className="board-metric">

                <span>Remaining</span>

                <h4>
                  {tasks.length - completedCount}
                </h4>

              </div>

            </div>

            <div className="col-6 col-md-3">

              <div className="board-metric">

                <span>Completion</span>

                <h4>{completionRate}%</h4>

              </div>

            </div>

          </div>

          {/* Completion Progress */}

          <div
            className="progress mt-3"
            style={{ height: '7px' }}
          >

            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{
                width: `${completionRate}%`
              }}
              aria-valuenow={completionRate}
              aria-valuemin="0"
              aria-valuemax="100"
            />

          </div>

        </div>

      </div>

      {/* Kanban Heading and Search */}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">

        <div>

          <h4 className="fw-bold mb-1">
            Kanban board
          </h4>

          <p className="text-secondary small mb-0">
            Drag and drop tasks to update their status.
          </p>

        </div>

        <div className="board-search">

          <i className="bi bi-search" />

          <input
            type="search"
            className="form-control"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

        </div>

      </div>

      {/* Error Message */}

      {error && (

        <div className="alert alert-danger py-2">
          {error}
        </div>

      )}

      {/* Kanban Columns */}

      <div className="kanban-board">

        {statuses.map((status) => {

          const columnTasks = filteredTasks.filter(
            (task) => task.status === status
          );

          return (

            <KanbanColumn
              key={status}
              status={status}
              tasks={columnTasks}
              onEdit={openEditModal}
              onDelete={handleDeleteTask}
              onDragStart={handleDragStart}
              onDropTask={handleDropTask}
              onDragOver={handleDragOver}
            />

          );

        })}

      </div>

      {/* Search Empty State */}

      {searchTerm && filteredTasks.length === 0 && (

        <div className="text-center text-secondary py-3">

          No tasks match "{searchTerm}".

        </div>

      )}

      {/* Task Form Modal */}

      <TaskFormModal
        show={showModal}
        onClose={() => {

          if (!saving) {

            setShowModal(false);
            setSelectedTask(null);

          }

        }}
        onSave={handleSaveTask}
        task={selectedTask}
        saving={saving}
      />

    </div>

  );

}

export default BoardDetailsPage;
