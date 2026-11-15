
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { getUserActivities } from '../../services/activityService';

function Notifications() {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError('');

      const data = await getUserActivities(user.id);

      setActivities(data.slice(0, 6));
    } catch (err) {
      console.error('Unable to load notifications:', err);
      setError('Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const getIcon = (action) => {
    if (action?.includes('created')) return 'bi-plus-circle';
    if (action?.includes('deleted')) return 'bi-trash';
    if (action?.includes('moved')) return 'bi-arrow-left-right';
    if (action?.includes('updated')) return 'bi-pencil-square';

    return 'bi-activity';
  };

  const formatTime = (value) => {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="notification-wrapper">
      <button
        type="button"
        className="btn notification-trigger"
        onClick={() => {
          const next = !open;
          setOpen(next);

          if (next) {
            loadNotifications();
          }
        }}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <i className="bi bi-bell" />

        {activities.length > 0 && (
          <span className="notification-indicator" />
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="notification-dismiss-layer"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />

          <div className="notification-panel">
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
              <div>
                <h6 className="fw-bold mb-0">Notifications</h6>
                <small className="text-secondary">
                  Recent workspace activity
                </small>
              </div>

              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setOpen(false)}
              />
            </div>

            <div className="notification-list">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" />
                  <p className="text-secondary small mt-2 mb-0">
                    Loading notifications...
                  </p>
                </div>
              ) : error ? (
                <div className="text-danger small p-3">
                  {error}
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-5 px-3">
                  <i className="bi bi-bell-slash fs-2 text-secondary" />
                  <p className="fw-semibold mt-2 mb-1">
                    No notifications yet
                  </p>
                  <small className="text-secondary">
                    Workspace activity will appear here.
                  </small>
                </div>
              ) : (
                activities.map((item) => (
                  <div className="notification-item" key={item.id}>
                    <span className="notification-item-icon">
                      <i className={`bi ${getIcon(item.action)}`} />
                    </span>

                    <div className="flex-grow-1">
                      <strong>{item.action}</strong>

                      <p className="small text-secondary mb-1">
                        {item.description}
                      </p>

                      <small className="text-secondary">
                        {formatTime(item.createdAt)}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-top text-center">
              <Link
                to="/activity"
                className="text-decoration-none small fw-semibold"
                onClick={() => setOpen(false)}
              >
                View all activity
                <i className="bi bi-arrow-right ms-2" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Notifications;
