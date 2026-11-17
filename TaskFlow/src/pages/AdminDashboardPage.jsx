
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function AdminDashboardPage() {
  const [data, setData] = useState({
    users: [],
    boards: [],
    tasks: [],
    activities: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError('');

        const [users, boards, tasks, activities] = await Promise.all([
          api.get('/users'),
          api.get('/boards'),
          api.get('/tasks'),
          api.get('/activities')
        ]);

        setData({
          users: users.data,
          boards: boards.data,
          tasks: tasks.data,
          activities: activities.data
        });
      } catch (err) {
        console.error('Admin dashboard error:', err);
        setError('Unable to load administration data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="text-secondary mt-3">
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const activeUsers = data.users.filter(
    (user) => user.status !== 'inactive'
  ).length;

  const completedTasks = data.tasks.filter(
    (task) => task.status === 'Completed'
  ).length;

  const recentUsers = [...data.users]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const statistics = [
    {
      title: 'Total Users',
      value: data.users.length,
      icon: 'bi-people',
      color: 'primary'
    },
    {
      title: 'Active Accounts',
      value: activeUsers,
      icon: 'bi-person-check',
      color: 'success'
    },
    {
      title: 'Total Boards',
      value: data.boards.length,
      icon: 'bi-kanban',
      color: 'info'
    },
    {
      title: 'Total Tasks',
      value: data.tasks.length,
      icon: 'bi-list-task',
      color: 'warning'
    }
  ];

  const taskStatuses = [
    'To Do',
    'In Progress',
    'Review',
    'Completed'
  ];

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Admin Overview</h3>
          <p className="text-secondary mb-0">
            Monitor TaskFlow accounts and workspace activity.
          </p>
        </div>

        <span className="badge text-bg-dark px-3 py-2">
          <i className="bi bi-shield-check me-2"></i>
          Administrator
        </span>
      </div>

      {/* STATISTICS */}
      <div className="row g-3 mb-4">
        {statistics.map((item) => (
          <div className="col-sm-6 col-xl-3" key={item.title}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-secondary small mb-2">
                      {item.title}
                    </p>
                    <h3 className="fw-bold mb-0">{item.value}</h3>
                  </div>

                  <div className={`rounded-3 bg-${item.color}-subtle text-${item.color} p-3`}>
                    <i className={`bi ${item.icon} fs-4`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* RECENT REGISTRATIONS */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold mb-1">
                    Recent Registrations
                  </h5>
                  <p className="text-secondary small mb-0">
                    Latest accounts created
                  </p>
                </div>

                <i className="bi bi-person-plus fs-4 text-primary"></i>
              </div>

              {recentUsers.length === 0 ? (
                <p className="text-secondary mb-0">
                  No registered users.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentUsers.map((account) => (
                        <tr key={account.id}>
                          <td className="fw-semibold">
                            {account.name}
                          </td>
                          <td className="text-secondary">
                            {account.email}
                          </td>
                          <td>
                            <span className={`badge ${account.role === 'admin' ? 'text-bg-dark' : 'text-bg-primary'}`}>
                              {account.role === 'admin' ? 'Admin' : 'User'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TASK OVERVIEW */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Task Overview</h5>

              {taskStatuses.map((status) => {
                const count = data.tasks.filter(
                  (task) => task.status === status
                ).length;

                return (
                  <div
                    className="d-flex justify-content-between border-bottom py-3"
                    key={status}
                  >
                    <span className="text-secondary">{status}</span>
                    <strong>{count}</strong>
                  </div>
                );
              })}

              <div className="d-flex justify-content-between pt-3">
                <span className="fw-semibold">Completion rate</span>
                <strong>
                  {data.tasks.length
                    ? Math.round(
                        (completedTasks / data.tasks.length) * 100
                      )
                    : 0}%
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* USER MANAGEMENT */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h5 className="fw-bold mb-1">User Management</h5>
            <p className="text-secondary mb-0">
              View registered accounts and their workspace statistics.
            </p>
          </div>

          <Link
            to="/admin/users"
            className="btn btn-primary"
          >
            Manage Users
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
