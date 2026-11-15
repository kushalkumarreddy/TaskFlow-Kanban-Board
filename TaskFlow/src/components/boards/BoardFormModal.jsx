
import { useEffect, useState } from 'react';

const colors = [
  '#315EFB',
  '#7C3AED',
  '#0891B2',
  '#059669',
  '#EA580C',
  '#DB2777',
  '#475569',
  '#CA8A04'
];

function BoardFormModal({ show, onClose, onSave, board, saving }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(colors[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      setName(board?.name || '');
      setDescription(board?.description || '');
      setColor(board?.color || colors[0]);
      setError('');
    }
  }, [show, board]);

  if (!show) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Please enter a board name.');
      return;
    }

    if (trimmedName.length > 40) {
      setError('Board name cannot exceed 40 characters.');
      return;
    }

    if (description.trim().length > 180) {
      setError('Description cannot exceed 180 characters.');
      return;
    }

    setError('');

    await onSave({
      name: trimmedName,
      description: description.trim(),
      color
    });
  };

  return (
    <div
      className="board-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div
        className="board-modal card border-0 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="boardModalTitle"
      >
        <div className="card-body p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1" id="boardModalTitle">
                {board ? 'Edit board' : 'Create a new board'}
              </h4>
              <p className="text-secondary small mb-0">
                Organize your work in one place.
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
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Board name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Website Redesign"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={40}
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Description
              </label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="What is this board for?"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={180}
              />
              <div className="text-end text-secondary small mt-1">
                {description.length}/180
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold d-block">
                Choose a board color
              </label>

              <div className="d-flex flex-wrap gap-3">
                {colors.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`board-color-option ${
                      color === item ? 'selected' : ''
                    }`}
                    style={{ backgroundColor: item }}
                    onClick={() => setColor(item)}
                    aria-label={`Select color ${item}`}
                    aria-pressed={color === item}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small">
                {error}
              </div>
            )}

            <div className="d-flex justify-content-end gap-2 mt-4">
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
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : board ? (
                  'Save changes'
                ) : (
                  'Create board'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BoardFormModal;
