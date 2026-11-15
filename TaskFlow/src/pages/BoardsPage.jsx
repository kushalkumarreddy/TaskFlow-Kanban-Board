
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  createBoard,
  deleteBoardWithTasks,
  getUserBoards,
  getUserTasksForBoards,
  updateBoard
} from '../services/boardService';
import BoardCard from '../components/boards/BoardCard';
import BoardFormModal from '../components/boards/BoardFormModal';

function BoardsPage() {
  const { user } = useAuth();

  const [boards, setBoards] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);

  const loadBoards = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError('');

      const [boardData, taskData] = await Promise.all([
        getUserBoards(user.id),
        getUserTasksForBoards(user.id)
      ]);

      const counts = {};

      boardData.forEach((board) => {
        counts[String(board.id)] = taskData.filter(
          (task) => String(task.boardId) === String(board.id)
        ).length;
      });

      setBoards(boardData);
      setTaskCounts(counts);
    } catch (err) {
      console.error('Unable to load boards:', err);
      setError('Unable to load your boards. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  const openCreateModal = () => {
    setSelectedBoard(null);
    setShowModal(true);
  };

  const openEditModal = (board) => {
    setSelectedBoard(board);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    try {
      setSaving(true);

      if (selectedBoard) {
        await updateBoard(selectedBoard.id, {
          ...formData,
          updatedAt: new Date().toISOString()
        });
      } else {
        await createBoard({
          ...formData,
          userId: user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      setShowModal(false);
      setSelectedBoard(null);
      await loadBoards();
    } catch (err) {
      console.error('Unable to save board:', err);
      setError('Unable to save the board. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (board) => {
    const taskCount = taskCounts[String(board.id)] || 0;

    const message = taskCount > 0
      ? `Delete "${board.name}" and its ${taskCount} associated task(s)? This cannot be undone.`
      : `Delete "${board.name}"? This cannot be undone.`;

    if (!window.confirm(message)) return;

    try {
      setError('');

      await deleteBoardWithTasks(board.id, user.id);
      await loadBoards();
    } catch (err) {
      console.error('Unable to delete board:', err);
      setError(
        'Unable to completely delete the board. Please refresh and check your data.'
      );
      await loadBoards();
    }
  };

  return (
    <div className="boards-page">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Boards</h2>
          <p className="text-secondary mb-0">
            Organize your projects and keep your work moving.
          </p>
        </div>

        <button
          className="btn btn-primary px-4"
          onClick={openCreateModal}
        >
          <i className="bi bi-plus-lg me-2" />
          Create board
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card border-0 boards-summary-card">
            <div className="card-body p-3">
              <div className="text-secondary small mb-1">
                Total boards
              </div>
              <h3 className="fw-bold mb-0">{boards.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card border-0 boards-summary-card">
            <div className="card-body p-3">
              <div className="text-secondary small mb-1">
                Total tasks in boards
              </div>
              <h3 className="fw-bold mb-0">
                {Object.values(taskCounts).reduce(
                  (total, count) => total + count,
                  0
                )}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={loadBoards}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-secondary mt-3 mb-0">
            Loading your boards...
          </p>
        </div>
      ) : boards.length === 0 ? (
        <div className="card border-0 boards-empty-state text-center">
          <div className="card-body py-5 px-3">
            <div className="empty-board-icon mx-auto mb-3">
              <i className="bi bi-kanban" />
            </div>
            <h4 className="fw-bold">No boards yet</h4>
            <p className="text-secondary mx-auto mb-4">
              Create your first board to start organizing your projects
              and tasks.
            </p>
            <button
              className="btn btn-primary px-4"
              onClick={openCreateModal}
            >
              <i className="bi bi-plus-lg me-2" />
              Create your first board
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {boards.map((board) => (
            <div className="col-12 col-md-6 col-xl-4" key={board.id}>
              <BoardCard
                board={board}
                taskCount={taskCounts[String(board.id)] || 0}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      <BoardFormModal
        show={showModal}
        onClose={() => {
          if (!saving) {
            setShowModal(false);
            setSelectedBoard(null);
          }
        }}
        onSave={handleSave}
        board={selectedBoard}
        saving={saving}
      />
    </div>
  );
}

export default BoardsPage;
