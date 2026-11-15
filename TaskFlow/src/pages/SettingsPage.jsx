
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const defaultPreferences = {
  compactView: false,
  showCompletedTasks: true,
  confirmBeforeDelete: true
};

function SettingsPage() {
  const { user } = useAuth();

  const [preferences, setPreferences] = useState(defaultPreferences);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('taskflow_preferences');

      if (stored) {
        setPreferences({
          ...defaultPreferences,
          ...JSON.parse(stored)
        });
      }
    } catch (error) {
      console.error('Unable to load preferences:', error);
    }
  }, []);

  const handlePreferenceChange = (name, value) => {
    setPreferences((previous) => ({
      ...previous,
      [name]: value
    }));

    setSaved(false);
  };

  const savePreferences = () => {
    localStorage.setItem(
      'taskflow_preferences',
      JSON.stringify(preferences)
    );

    setSaved(true);
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.setItem(
      'taskflow_preferences',
      JSON.stringify(defaultPreferences)
    );
    setSaved(true);
  };

  const initials = user?.name
    ? user.name.trim().charAt(0).toUpperCase()
    : 'U';

  return (
    <div className="settings-page">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Settings</h2>
        <p className="text-secondary mb-0">
          Manage your profile information and workspace preferences.
        </p>
      </div>

      {/* Profile */}
      <div className="card border-0 settings-card mb-4">
        <div className="card-body p-4">
          <div className="mb-4">
            <h5 className="fw-bold mb-1">Profile information</h5>
            <p className="text-secondary small mb-0">
              Your current TaskFlow account details.
            </p>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
            <div className="settings-avatar">{initials}</div>

            <div>
              <h6 className="fw-bold mb-1">{user?.name || 'User'}</h6>
              <span className="text-secondary small">
                Workspace Member
              </span>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">
                Full name
              </label>
              <input
                className="form-control"
                value={user?.name || ''}
                readOnly
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">
                Email address
              </label>
              <input
                className="form-control"
                value={user?.email || ''}
                readOnly
              />
            </div>
          </div>

          <div className="alert alert-info small mt-3 mb-0">
            Profile editing is not enabled in this version. These fields
            display your registered account information.
          </div>
        </div>
      </div>

      {/* Workspace preferences */}
      <div className="card border-0 settings-card mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-1">Workspace preferences</h5>
          <p className="text-secondary small mb-4">
            Customize how TaskFlow displays your work.
          </p>

          <div className="settings-option">
            <div>
              <h6 className="fw-semibold mb-1">Compact view</h6>
              <p className="text-secondary small mb-0">
                Use a more compact layout for workspace content.
              </p>
            </div>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={preferences.compactView}
                onChange={(event) =>
                  handlePreferenceChange('compactView', event.target.checked)
                }
              />
            </div>
          </div>

          <div className="settings-option">
            <div>
              <h6 className="fw-semibold mb-1">Show completed tasks</h6>
              <p className="text-secondary small mb-0">
                Keep completed tasks visible in your workspace.
              </p>
            </div>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={preferences.showCompletedTasks}
                onChange={(event) =>
                  handlePreferenceChange(
                    'showCompletedTasks',
                    event.target.checked
                  )
                }
              />
            </div>
          </div>

          <div className="settings-option">
            <div>
              <h6 className="fw-semibold mb-1">Confirm before deleting</h6>
              <p className="text-secondary small mb-0">
                Ask for confirmation before deleting workspace items.
              </p>
            </div>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={preferences.confirmBeforeDelete}
                onChange={(event) =>
                  handlePreferenceChange(
                    'confirmBeforeDelete',
                    event.target.checked
                  )
                }
              />
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 mt-4">
            <button
              className="btn btn-primary"
              onClick={savePreferences}
            >
              <i className="bi bi-check2 me-2" />
              Save preferences
            </button>

            <button
              className="btn btn-light border"
              onClick={resetPreferences}
            >
              Reset preferences
            </button>
          </div>

          {saved && (
            <div className="alert alert-success py-2 small mt-3 mb-0">
              Preferences saved successfully.
            </div>
          )}
        </div>
      </div>

      {/* Application information */}
      <div className="card border-0 settings-card">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">About TaskFlow</h5>

          <div className="d-flex justify-content-between align-items-center">
            <span className="text-secondary">Application</span>
            <strong>TaskFlow</strong>
          </div>

          <hr />

          <div className="d-flex justify-content-between align-items-center">
            <span className="text-secondary">Version</span>
            <strong>1.0.0</strong>
          </div>

          <hr />

          <div className="d-flex justify-content-between align-items-center">
            <span className="text-secondary">Technology</span>
            <strong>React + JSON Server</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
