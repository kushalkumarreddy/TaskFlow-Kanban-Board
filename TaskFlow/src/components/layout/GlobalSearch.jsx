
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { getUserBoards } from '../../services/boardService';
import { getUserTasks } from '../../services/taskService';

function GlobalSearch() {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !user?.id) return;

    let active = true;

    const loadSearchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [boardData, taskData] = await Promise.all([
          getUserBoards(user.id),
          getUserTasks(user.id)
        ]);

        if (active) {
          setBoards(boardData);
          setTasks(taskData);
        }
      } catch (err) {
        console.error('Global search loading failed:', err);

        if (active) {
          setError('Unable to load search results.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSearchData();

    return () => {
      active = false;
    };
  }, [open, user?.id]);

  const search = query.trim().toLowerCase();

  const matchingBoards = search
    ? boards.filter((board) =>
        [board.name, board.description]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(search)
          )
      ).slice(0, 5)
    : [];

  const matchingTasks = search
    ? tasks.filter((task) =>
        [task.title, task.description, task.category]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(search)
          )
      ).slice(0, 8)
    : [];

  const closeSearch = () => {
    setOpen(false);
    setQuery('');
    setError('');
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((previous) => !previous);
      }

      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="btn global-search-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open global search"
      >
        <i className="bi bi-search" />
        <span className="d-none d-md-inline">Search anything...</span>
        <kbd className="d-none d-lg-inline">Ctrl K</kbd>
      </button>

      {open && (
        <div
          className="global-search-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeSearch();
            }
          }}
        >
          <div
            className="global-search-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Global search"
          >
            <div className="global-search-input">
              <i className="bi bi-search" />

              <input
                type="search"
                autoFocus
                placeholder="Search boards and tasks..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />

              <button
                type="button"
                className="btn btn-sm btn-light border"
                onClick={closeSearch}
              >
                ESC
              </button>
            </div>

            <div className="global-search-results">
              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" />
                  <p className="small text-secondary mt-2 mb-0">
                    Loading your workspace...
                  </p>
                </div>
              )}

              {error && (
                <div className="alert alert-danger m-3">
                  {error}
                </div>
              )}

              {!loading && !error && !search && (
                <div className="text-center py-5 text-secondary">
                  <i className="bi bi-search fs-2 d-block mb-2" />
                  <p className="mb-1 fw-semibold">
                    Search your workspace
                  </p>
                  <small>Enter a board name or task title.</small>
                </div>
              )}

              {!loading && !error && search && (
                <>
                  {matchingBoards.length > 0 && (
                    <div className="global-search-section">
                      <div className="global-search-heading">
                        <i className="bi bi-kanban me-2" />
                        Boards
                      </div>

                      {matchingBoards.map((board) => (
                        <Link
                          key={board.id}
                          to={`/boards/${board.id}`}
                          className="global-search-result"
                          onClick={closeSearch}
                        >
                          <span className="global-result-icon">
                            <i className="bi bi-kanban" />
                          </span>

                          <span className="flex-grow-1">
                            <strong>{board.name}</strong>
                            <small>
                              {board.description || 'Project board'}
                            </small>
                          </span>

                          <i className="bi bi-arrow-up-right" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {matchingTasks.length > 0 && (
                    <div className="global-search-section">
                      <div className="global-search-heading">
                        <i className="bi bi-check2-square me-2" />
                        Tasks
                      </div>

                      {matchingTasks.map((task) => (
                        <Link
                          key={task.id}
                          to={`/boards/${task.boardId}`}
                          className="global-search-result"
                          onClick={closeSearch}
                        >
                          <span className="global-result-icon">
                            <i className="bi bi-card-checklist" />
                          </span>

                          <span className="flex-grow-1">
                            <strong>{task.title}</strong>
                            <small>
                              {task.status || 'To Do'} ·{' '}
                              {task.priority || 'Medium'} priority
                            </small>
                          </span>

                          <i className="bi bi-arrow-up-right" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {matchingBoards.length === 0 &&
                    matchingTasks.length === 0 && (
                      <div className="text-center py-5 text-secondary">
                        <i className="bi bi-search fs-2 d-block mb-2" />
                        <p className="fw-semibold mb-1">
                          No results found
                        </p>
                        <small>Try a different search term.</small>
                      </div>
                    )}
                </>
              )}
            </div>

            <div className="global-search-footer">
              <span>Search boards and tasks</span>
              <span>Press ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GlobalSearch;
