
import { useEffect, useState } from 'react';

const initialForm = {
  title: '',
  description: '',
  priority: 'Medium',
  dueDate: '',
  category: '',
  boardId: ''
};

function TaskFormModal({
  show,
  onClose,
  onSave,
  task,
  saving,
  boards = [],
  requireBoard = false
}) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      setForm({
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority || 'Medium',
        dueDate: task?.dueDate || '',
        category: task?.category || '',
        boardId: task?.boardId
          ? String(task.boardId)
          : ''
      });

      setError('');
    }
  }, [show, task]);

  if (!show) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError('Please enter a task title.');
      return;
    }

    if (form.title.trim().length > 100) {
      setError('Task title cannot exceed 100 characters.');
      return;
    }

    if (form.description.length > 500) {
      setError('Description cannot exceed 500 characters.');
      return;
    }

    if (form.category.trim().length > 40) {
      setError('Category cannot exceed 40 characters.');
      return;
    }

    if (requireBoard && !form.boardId) {
      setError('Please select a board for this task.');
      return;
    }

    setError('');

    try {
      await onSave({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim()
      });
    } catch (err) {
      setError(
        err.message || 'Unable to save task. Please try again.'
      );
    }
  };

  return (
    <div
      className="task-modal-backdrop"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !saving
        ) {
          onClose();
        }
      }}
    >
      <div
        className="card border-0 shadow-lg task-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="taskModalTitle"
      >
        <div className="card-body p-4">

          {/* MODAL HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1" id="taskModalTitle">
                {task ? 'Edit task' : 'Create new task'}
              </h4>

              <p className="text-secondary small mb-0">
                Add details to keep your work organized.
              </p>
            </div>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={saving}
              aria-label="Close"
            />
          </div>

          <form onSubmit={handleSubmit}>

            {/* BOARD SELECTOR */}
            {requireBoard && (
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Select board *
                </label>

                <select
                  name="boardId"
                  className="form-select"
                  value={form.boardId}
                  onChange={handleChange}
                  required
                  disabled={boards.length === 0 || saving}
                >
                  <option value="">
                    Choose a board
                  </option>

                  {boards.map((board) => (
                    <option
                      key={board.id}
                      value={String(board.id)}
                    >
                      {board.name}
                    </option>
                  ))}
                </select>

                {boards.length === 0 && (
                  <small className="text-danger">
                    You need to create a board before adding a task.
                  </small>
                )}
              </div>
            )}

            {/* TASK TITLE */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Task title *
              </label>

              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Enter task title"
                value={form.title}
                onChange={handleChange}
                maxLength={100}
                autoFocus
                disabled={saving}
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Description
              </label>

              <textarea
                name="description"
                className="form-control"
                rows="3"
                placeholder="Describe what needs to be done..."
                value={form.description}
                onChange={handleChange}
                maxLength={500}
                disabled={saving}
              />

              <div className="text-end text-secondary small mt-1">
                {form.description.length}/500
              </div>
            </div>

            {/* PRIORITY AND DUE DATE */}
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Priority
                </label>

                <select
                  name="priority"
                  className="form-select"
                  value={form.priority}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Due date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  className="form-control"
                  value={form.dueDate}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
            </div>

            {/* CATEGORY */}
            <div className="mt-3 mb-4">
              <label className="form-label fw-semibold">
                Category
              </label>

              <input
                type="text"
                name="category"
                className="form-control"
                placeholder="e.g. Development, Design, Testing"
                value={form.category}
                onChange={handleChange}
                maxLength={40}
                disabled={saving}
              />
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div
                className="alert alert-danger py-2 small"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="d-flex justify-content-end gap-2">

              <button
                type="button"
                className="btn btn-light border"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={
                  saving ||
                  (requireBoard && boards.length === 0)
                }
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : task ? (
                  'Save changes'
                ) : (
                  'Create task'
                )}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskFormModal;
