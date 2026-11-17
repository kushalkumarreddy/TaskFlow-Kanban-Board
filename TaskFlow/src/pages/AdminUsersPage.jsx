
import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');

        const [usersResponse, boardsResponse, tasksResponse] =
          await Promise.all([
            api.get('/users'),
            api.get('/boards'),
            api.get('/tasks')
          ]);

        setUsers(usersResponse.data);
        setBoards(boardsResponse.data);
        setTasks(tasksResponse.data);
      } catch (err) {
        console.error('User management error:', err);
        setError('Unable to load user accounts.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query)
      );
    });
  }, [users, search]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="text-secondary mt-3">Loading user accounts...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">User Management</h3>
          <p className="text-secondary mb-0">
            View registered accounts and workspace summaries.
          </p>
        </div>

        <span className="badge text-bg-primary px-3 py-2">
          {users.length} Accounts
        </span>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="row align-items-center mb-3">
            <div className="col-md-6 col-lg-5">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>

                <input
                  type="search"
                  className="form-control"
                  placeholder="Search name, email or role..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <span className="text-secondary small">
                Showing {filteredUsers.length} of {users.length} accounts
              </span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Account</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Boards</th>
                  <th>Tasks</th>
                  <th>Registered</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => {
                  const userBoards = boards.filter(
                    (board) => String(board.userId) === String(user.id)
                  ).length;

                  const userTasks = tasks.filter(
                    (task) => String(task.userId) === String(user.id)
                  ).length;

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: 38, height: 38 }}
                          >
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>

                          <span className="fw-semibold">{user.name}</span>
                        </div>
                      </td>

                      <td>{user.email}</td>

                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'text-bg-dark' : 'text-bg-primary'}`}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>

                      <td>{userBoards}</td>
                      <td>{userTasks}</td>

                      <td className="text-secondary small">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('en-IN')
                          : 'Not available'}
                      </td>

                      <td>
                        <span className={`badge ${user.status === 'inactive' ? 'text-bg-secondary' : 'text-bg-success'}`}>
                          {user.status === 'inactive' ? 'Inactive' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-secondary py-4">
                      No matching accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-secondary small mb-0 mt-3">
            Account passwords and private credentials are not displayed.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminUsersPage;
