
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserActivities } from '../services/activityService';

function ActivityPage() {
  const { user } = useAuth();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  const loadActivities = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError('');

      const data = await getUserActivities(user.id);
      setActivities(data);
    } catch (err) {
      console.error('Unable to load activity:', err);
      setError('Unable to load activity history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const getActivityIcon = (action) => {
    const icons = {
      'Task created': 'bi-plus-circle',
      'Task updated': 'bi-pencil-square',
      'Task deleted': 'bi-trash',
      'Task moved': 'bi-arrow-left-right',
      'Board created': 'bi-kanban',
      'Board updated': 'bi-pencil',
      'Board deleted': 'bi-folder-minus'
    };

    return icons[action] || 'bi-activity';
  };

  const getActivityColor = (action) => {
    if (action?.includes('deleted')) return 'activity-danger';
    if (action?.includes('created')) return 'activity-success';
    if (action?.includes('moved')) return 'activity-info';
    return 'activity-primary';
  };

  const filteredActivities = activities.filter((item) => {
    if (filter === 'All') return true;
    if (filter === 'Tasks') return item.action?.startsWith('Task');
    if (filter === 'Boards') return item.action?.startsWith('Board');
    return true;
  });

  const formatDate = (value) => {
    if (!value) return 'Unknown date';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return 'Unknown date';

    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const groupedActivities = filteredActivities.reduce((groups, item) => {
    const date = item.createdAt
      ? new Date(item.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      : 'Unknown date';

    if (!groups[date]) groups[date] = [];
    groups[date].push(item);

    return groups;
  }, {});

  return (
    <div className="activity-page">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Activity History</h2>
          <p className="text-secondary mb-0">
            Follow the changes made across your workspace.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={loadActivities}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2" />
          Refresh
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4">
          <div className="card border-0 activity-stat-card">
            <div className="card-body p-3">
              <span className="text-secondary small">
                Total activities
              </span>
              <h3 className="fw-bold mb-0 mt-2">
                {activities.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-4">
          <div className="card border-0 activity-stat-card">
            <div className="card-body p-3">
              <span className="text-secondary small">
                Task activities
              </span>
              <h3 className="fw-bold mb-0 mt-2">
                {activities.filter((item) =>
                  item.action?.startsWith('Task')
                ).length}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 activity-stat-card">
            <div className="card-body p-3">
              <span className="text-secondary small">
                Board activities
              </span>
              <h3 className="fw-bold mb-0 mt-2">
                {activities.filter((item) =>
                  item.action?.startsWith('Board')
                ).length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 activity-history-card">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <h5 className="fw-bold mb-0">Workspace timeline</h5>

            <select
              className="form-select activity-filter"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="All">All activities</option>
              <option value="Tasks">Task activities</option>
              <option value="Boards">Board activities</option>
            </select>
          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
              <button
                className="btn btn-sm btn-outline-danger ms-3"
                onClick={loadActivities}
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
              <p className="text-secondary mt-3">
                Loading activity...
              </p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-clock-history fs-1 text-secondary" />
              <h5 className="fw-bold mt-3">No activities yet</h5>
              <p className="text-secondary">
                Activities will appear here as you work on your boards and tasks.
              </p>
              <Link to="/boards" className="btn btn-primary">
                Open My Boards
              </Link>
            </div>
          ) : (
            <div className="activity-timeline">
              {Object.entries(groupedActivities).map(([date, items]) => (
                <div className="activity-date-group" key={date}>
                  <h6 className="activity-date-heading">{date}</h6>

                  {items.map((item) => (
                    <div className="activity-item" key={item.id}>
                      <div className={`activity-icon ${getActivityColor(item.action)}`}>
                        <i className={`bi ${getActivityIcon(item.action)}`} />
                      </div>

                      <div className="activity-content">
                        <div className="d-flex flex-wrap justify-content-between gap-2">
                          <strong>{item.action || 'Workspace activity'}</strong>
                          <small className="text-secondary">
                            {formatDate(item.createdAt)}
                          </small>
                        </div>

                        <p className="text-secondary small mb-1">
                          {item.description}
                        </p>

                        {item.boardName && (
                          <small className="text-secondary">
                            <i className="bi bi-kanban me-1" />
                            {item.boardName}
                          </small>
                        )}

                        {item.boardId && (
                          <div className="mt-2">
                            <Link
                              to={`/boards/${item.boardId}`}
                              className="small text-decoration-none"
                            >
                              Open board
                              <i className="bi bi-arrow-up-right ms-1" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityPage;
