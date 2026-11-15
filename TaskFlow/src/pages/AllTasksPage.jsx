
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserTasks, updateTask, deleteTask } from '../services/taskService';
import { getUserBoards } from '../services/boardService';
import TaskFormModal from '../components/boards/TaskFormModal';

function AllTasksPage() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [boardFilter, setBoardFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError('');

      const [taskData, boardData] = await Promise.all([
        getUserTasks(user.id),
        getUserBoards(user.id)
      ]);

      setTasks(taskData);
      setBoards(boardData);
    } catch (err) {
      console.error('Unable to load tasks:', err);
      setError('Unable to load your tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const boardNames = useMemo(() => {
    return Object.fromEntries(
      boards.map((board) => [String(board.id), board.name])
    );
  }, [boards]);

  const filteredTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    let result = tasks.filter((task) => {
      const searchText = [
        task.title,
        task.description,
        task.category,
        boardNames[String(task.boardId)]
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (search && !searchText.includes(search.toLowerCase())) {
        return false;
      }

      if (statusFilter !== 'All' && task.status !== statusFilter) {
        return false;
      }

      if (
        priorityFilter !== 'All' &&
        (task.priority || 'Medium') !== priorityFilter
      ) {
        return false;
      }

      if (
        boardFilter !== 'All' &&
        String(task.boardId) !== String(boardFilter)
      ) {
        return false;
      }

      if (dateFilter !== 'All') {
        if (!task.dueDate) return false;

        const dueDate = new Date(`${task.dueDate}T00:00:00`);

        if (Number.isNaN(dueDate.getTime())) return false;

        const isOverdue =
          dueDate < today && task.status !== 'Completed';

        if (dateFilter === 'Overdue' && !isOverdue) return false;

        if (
          dateFilter === 'Today' &&
          (dueDate < today || dueDate >= tomorrow)
        ) {
          return false;
        }

        if (
          dateFilter === 'Next 7 days' &&
          (dueDate < today || dueDate >= nextWeek)
        ) {
          return false;
        }

        if (dateFilter === 'No date') return false;
      }

      return true;
    });

    if (dateFilter === 'No date') {
      result = tasks.filter((task) => {
        const searchText = [
          task.title,
          task.description,
          task.category,
          boardNames[String(task.boardId)]
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return (
          !task.dueDate &&
          (!search || searchText.includes(search.toLowerCase())) &&
          (statusFilter === 'All' || task.status === statusFilter) &&
          (priorityFilter === 'All' ||
            (task.priority || 'Medium') === priorityFilter) &&
          (boardFilter === 'All' ||
            String(task.boardId) === String(boardFilter))
        );
      });
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }

      if (sortBy === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }

      if (sortBy === 'priority') {
        const rank = { High: 1, Medium: 2, Low: 3 };
        return (
          (rank[a.priority] || 2) - (rank[b.priority] || 2)
        );
      }

      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }

      return 0;
    });

    return result;
  }, [
    tasks,
    boards,
    boardNames,
    search,
    statusFilter,
    priorityFilter,
    boardFilter,
    dateFilter,
    sortBy
  ]);

  const openEditModal = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleSaveTask = async (formData) => {
    try {
      setSaving(true);
      setError('');

      await updateTask(selectedTask.id, {
        ...formData,
        updatedAt: new Date().toISOString()
      });

      setShowModal(false);
      setSelectedTask(null);
      await loadData();
    } catch (err) {
      console.error('Unable to update task:', err);
      setError('Unable to update the task. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteTask(task.id);
      setTasks((current) =>
        current.filter((item) => String(item.id) !== String(task.id))
      );
    } catch (err) {
      console.error('Unable to delete task:', err);
      setError('Unable to delete the task. Please try again.');
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    const previousTasks = tasks;

    setTasks((current) =>
      current.map((item) =>
        String(item.id) === String(task.id)
          ? { ...item, status: newStatus }
          : item
      )
    );

    try {
      await updateTask(task.id, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      setTasks(previousTasks);
      setError('Unable to update task status. Please try again.');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setBoardFilter('All');
    setDateFilter('All');
    setSortBy('dueDate');
  };

  const getPriorityClass = (priority) => {
    if (priority === 'High') return 'priority-high';
    if (priority === 'Low') return 'priority-low';
    return 'priority-medium';
  };

  const getDueDateState = (task) => {
    if (!task.dueDate) return 'No due date';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(`${task.dueDate}T00:00:00`);

    if (task.status !== 'Completed' && due < today) {
      return 'Overdue';
    }

    return due.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const statuses = ['To Do', 'In Progress', 'Review', 'Completed'];

  return (
    <div className="all-tasks-page">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">All Tasks</h2>
          <p className="text-secondary mb-0">
            Manage tasks from all your project boards.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={loadData}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2" />
          Refresh
        </button>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: 'Total tasks', value: tasks.length },
          {
            label: 'In progress',
            value: tasks.filter((task) => task.status === 'In Progress').length
          },
          {
            label: 'Completed',
            value: tasks.filter((task) => task.status === 'Completed').length
          },
          {
            label: 'Overdue',
            value: tasks.filter((task) => getDueDateState(task) === 'Overdue').length
          }
        ].map((item) => (
          <div className="col-6 col-xl-3" key={item.label}>
            <div className="card border-0 all-task-stat h-100">
              <div className="card-body p-3">
                <div className="text-secondary small">{item.label}</div>
                <h3 className="fw-bold mb-0 mt-2">{item.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 all-task-filter-card mb-4">
        <div className="card-body p-3">
          <div className="row g-3">
            <div className="col-12 col-lg-4">
              <label className="form-label small fw-semibold">
                Search tasks
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search" />
                </span>
                <input
                  className="form-control"
                  placeholder="Search title, description or board..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div className="col-6 col-lg-2">
              <label className="form-label small fw-semibold">Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="col-6 col-lg-2">
              <label className="form-label small fw-semibold">Priority</label>
              <select
                className="form-select"
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
              >
                <option value="All">All priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="col-6 col-lg-2">
              <label className="form-label small fw-semibold">Board</label>
              <select
                className="form-select"
                value={boardFilter}
                onChange={(event) => setBoardFilter(event.target.value)}
              >
                <option value="All">All boards</option>
                {boards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6 col-lg-2">
              <label className="form-label small fw-semibold">Due date</label>
              <select
                className="form-select"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
              >
                <option value="All">Any date</option>
                <option value="Today">Today</option>
                <option value="Next 7 days">Next 7 days</option>
                <option value="Overdue">Overdue</option>
                <option value="No date">No due date</option>
              </select>
            </div>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
            <span className="text-secondary small">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </span>

            <div className="d-flex align-items-center gap-2">
              <label className="small text-secondary">Sort:</label>
              <select
                className="form-select form-select-sm"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="dueDate">Due date</option>
                <option value="priority">Priority</option>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>

              <button
                className="btn btn-sm btn-light border"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={loadData}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="text-secondary mt-3">Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="card border-0 text-center all-tasks-empty py-5">
          <div className="card-body">
            <i className="bi bi-clipboard2-check fs-1 text-secondary" />
            <h5 className="fw-bold mt-3">No tasks found</h5>
            <p className="text-secondary mb-3">
              Try changing your filters or create a task inside one of your boards.
            </p>
            <Link to="/boards" className="btn btn-primary">
              Go to My Boards
            </Link>
          </div>
        </div>
      ) : (
        <div className="card border-0 all-task-table-card">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Board</th>
                  <th>Priority</th>
                  <th>Due date</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <div className="fw-semibold">{task.title}</div>
                      <small className="text-secondary">
                        {task.category || 'General'}
                      </small>
                    </td>

                    <td>
                      <Link
                        to={`/boards/${task.boardId}`}
                        className="text-decoration-none"
                      >
                        {boardNames[String(task.boardId)] || 'Unknown board'}
                      </Link>
                    </td>

                    <td>
                      <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                        {task.priority || 'Medium'}
                      </span>
                    </td>

                    <td>
                      <span className={
                        getDueDateState(task) === 'Overdue'
                          ? 'text-danger fw-semibold'
                          : 'text-secondary'
                      }>
                        {getDueDateState(task)}
                      </span>
                    </td>

                    <td>
                      <select
                        className="form-select form-select-sm task-status-select"
                        value={task.status}
                        onChange={(event) =>
                          handleStatusChange(task, event.target.value)
                        }
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-light border me-1"
                        title="Edit task"
                        onClick={() => openEditModal(task)}
                      >
                        <i className="bi bi-pencil" />
                      </button>

                      <button
                        className="btn btn-sm btn-light border text-danger"
                        title="Delete task"
                        onClick={() => handleDelete(task)}
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

export default AllTasksPage;
