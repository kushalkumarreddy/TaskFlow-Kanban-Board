
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import {
  getUserTasks,
  createTask
} from '../services/taskService';

import { getUserBoards } from '../services/boardService';

import { logActivity } from '../utils/activityLogger';

import {
  isTaskOverdue,
  isUpcomingTask
} from '../utils/dateUtils';

import StatCard from '../components/dashboard/StatCard';
import RecentTasks from '../components/dashboard/RecentTasks';
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines';
import TaskFormModal from '../components/boards/TaskFormModal';

function DashboardPage() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Quick Create Task states
  const [boards, setBoards] = useState([]);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [boardLoading, setBoardLoading] = useState(false);

  // Fetch tasks from JSON Server
  const fetchTasks = useCallback(async () => {
    if (!user?.id) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await getUserTasks(user.id);
      setTasks(response);
    } catch (err) {
      setError(err.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Open Quick Create Task modal and load user's boards
  const handleOpenQuickCreate = async () => {
    if (!user?.id) return;

    try {
      setBoardLoading(true);

      const userBoards = await getUserBoards(user.id);

      setBoards(userBoards);
      setShowQuickCreate(true);
    } catch (err) {
      console.error('Unable to load boards:', err);
      window.alert('Unable to load your boards. Please try again.');
    } finally {
      setBoardLoading(false);
    }
  };

  // Save a task from the dashboard
  const handleSaveQuickTask = async (formData) => {
    if (!user?.id) {
      throw new Error('Please log in again.');
    }

    setSavingTask(true);

    try {
      const selectedBoard = boards.find(
        (board) => String(board.id) === String(formData.boardId)
      );

      if (!selectedBoard) {
        throw new Error('Please select a valid board.');
      }

      const now = new Date().toISOString();

      const newTask = await createTask({
        userId: user.id,
        boardId: selectedBoard.id,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate,
        category: formData.category,
        status: 'To Do',
        createdAt: now,
        updatedAt: now
      });

      // Record task creation in Activity History
      await logActivity({
        userId: user.id,
        action: 'Task created',
        description: `Created task "${newTask.title}" in "${selectedBoard.name}".`,
        boardId: selectedBoard.id,
        boardName: selectedBoard.name,
        taskId: newTask.id,
        taskTitle: newTask.title
      });

      setShowQuickCreate(false);

      // Refresh dashboard data
      await fetchTasks();
    } catch (err) {
      console.error('Quick task creation failed:', err);

      throw new Error(
        err.response?.data?.message ||
        err.message ||
        'Unable to create task. Please try again.'
      );
    } finally {
      setSavingTask(false);
    }
  };

  // Calculate dashboard statistics
  const statistics = useMemo(() => {
    const totalTasks = tasks.length;

    const todoTasks = tasks.filter(
      (task) => task.status === 'To Do'
    ).length;

    const inProgressTasks = tasks.filter(
      (task) => task.status === 'In Progress'
    ).length;

    const reviewTasks = tasks.filter(
      (task) => task.status === 'Review'
    ).length;

    const completedTasks = tasks.filter(
      (task) => task.status === 'Completed'
    ).length;

    const overdueTasks = tasks.filter(
      isTaskOverdue
    ).length;

    const completionRate = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    return {
      totalTasks,
      todoTasks,
      inProgressTasks,
      reviewTasks,
      completedTasks,
      overdueTasks,
      completionRate
    };
  }, [tasks]);

  // Get five recently updated tasks
  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => {
        const dateA = new Date(
          a.updatedAt || a.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b.updatedAt || b.createdAt || 0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [tasks]);

  // Get upcoming deadlines within seven days
  const upcomingTasks = useMemo(() => {
    return tasks
      .filter(isUpcomingTask)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5);
  }, [tasks]);

  // Current greeting
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good morning';
    }

    if (hour < 17) {
      return 'Good afternoon';
    }

    return 'Good evening';
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-border text-primary"></div>

        <p className="text-secondary mt-3">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-error">
        <i className="bi bi-exclamation-triangle text-danger fs-1"></i>

        <h5 className="fw-bold mt-3">
          Unable to load dashboard
        </h5>

        <p className="text-secondary">
          {error}
        </p>

        <button
          className="btn btn-primary px-4"
          onClick={fetchTasks}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* WELCOME SECTION */}
      <div className="dashboard-welcome-header mb-4">
        <div>
          <span className="dashboard-date">
            <i className="bi bi-calendar3 me-2"></i>

            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>

          <h3 className="fw-bold mt-2">
            {getGreeting()}, {user?.name || 'User'}!
          </h3>

          <p className="text-secondary mb-0">
            Here's an overview of your productivity today.
          </p>
        </div>

        <Link
          to="/boards"
          className="btn btn-primary dashboard-create-btn"
        >
          <i className="bi bi-plus-lg me-2"></i>
          Create Board
        </Link>
      </div>

      {/* STATISTICS CARDS */}
      <div className="row g-3 mb-4">
        <StatCard
          title="Total Tasks"
          value={statistics.totalTasks}
          icon="bi-list-task"
          color="blue"
          description="All your tasks"
        />

        <StatCard
          title="To Do"
          value={statistics.todoTasks}
          icon="bi-circle"
          color="purple"
          description="Waiting to start"
        />

        <StatCard
          title="In Progress"
          value={statistics.inProgressTasks}
          icon="bi-arrow-repeat"
          color="orange"
          description="Currently working"
        />

        <StatCard
          title="Review"
          value={statistics.reviewTasks}
          icon="bi-eye"
          color="cyan"
          description="Awaiting review"
        />

        <StatCard
          title="Completed"
          value={statistics.completedTasks}
          icon="bi-check-circle"
          color="green"
          description="Successfully finished"
        />

        <StatCard
          title="Overdue"
          value={statistics.overdueTasks}
          icon="bi-exclamation-circle"
          color="red"
          description="Past their deadlines"
        />
      </div>

      {/* PRODUCTIVITY OVERVIEW AND QUICK ACTIONS */}
      <div className="row g-3 mb-4">

        {/* PRODUCTIVITY OVERVIEW */}
        <div className="col-lg-7">
          <div className="dashboard-panel productivity-panel h-100">
            <div className="panel-header">
              <div>
                <h5 className="fw-bold mb-1">
                  Productivity Overview
                </h5>

                <p className="text-secondary small mb-0">
                  Your overall task completion progress
                </p>
              </div>

              <i className="bi bi-graph-up-arrow text-primary fs-4"></i>
            </div>

            <div className="productivity-content">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h2 className="productivity-percentage mb-1">
                    {statistics.completionRate}%
                  </h2>

                  <span className="text-secondary small">
                    Completion rate
                  </span>
                </div>

                <div className="productivity-circle">
                  <i className="bi bi-trophy"></i>
                </div>
              </div>

              <div className="progress productivity-progress">
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{
                    width: `${statistics.completionRate}%`
                  }}
                  aria-valuenow={statistics.completionRate}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <small className="text-secondary">
                  {statistics.completedTasks} completed
                </small>

                <small className="text-secondary">
                  {statistics.totalTasks} total tasks
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="col-lg-5">
          <div className="dashboard-panel h-100">
            <div className="panel-header">
              <div>
                <h5 className="fw-bold mb-1">
                  Quick Actions
                </h5>

                <p className="text-secondary small mb-0">
                  Access your workspace quickly
                </p>
              </div>

              <i className="bi bi-lightning-charge text-warning fs-4"></i>
            </div>

            <div className="quick-actions-grid">

              <Link to="/boards" className="quick-action">
                <i className="bi bi-kanban"></i>
                <span>My Boards</span>
              </Link>

              <button
                type="button"
                className="quick-action border-0"
                onClick={handleOpenQuickCreate}
                disabled={boardLoading}
                style={{
                  cursor: boardLoading ? 'wait' : 'pointer',
                  textAlign: 'left',
                  background: 'transparent'
                }}
              >
                {boardLoading ? (
                  <span className="spinner-border spinner-border-sm text-primary"></span>
                ) : (
                  <i className="bi bi-plus-square"></i>
                )}

                <span>
                  {boardLoading ? 'Loading...' : 'Create Task'}
                </span>
              </button>

              <Link to="/tasks" className="quick-action">
                <i className="bi bi-list-task"></i>
                <span>All Tasks</span>
              </Link>

              <Link to="/calendar" className="quick-action">
                <i className="bi bi-calendar3"></i>
                <span>Calendar</span>
              </Link>

              <Link to="/activity" className="quick-action">
                <i className="bi bi-clock-history"></i>
                <span>Activity</span>
              </Link>

            </div>
          </div>
        </div>
      </div>

      {/* RECENT TASKS AND DEADLINES */}
      <div className="row g-3 mb-4">
        <div className="col-lg-7">
          <RecentTasks tasks={recentTasks} />
        </div>

        <div className="col-lg-5">
          <UpcomingDeadlines tasks={upcomingTasks} />
        </div>
      </div>

      {/* EMPTY STATE */}
      {tasks.length === 0 && (
        <div className="dashboard-first-task">
          <i className="bi bi-rocket-takeoff"></i>

          <h5 className="fw-bold mt-3">
            Let's get started!
          </h5>

          <p className="text-secondary">
            You haven't created any tasks yet.
            Create your first board and start organizing your work.
          </p>

          <Link
            to="/boards"
            className="btn btn-primary px-4"
          >
            Create Your First Board
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      )}

      {/* REFRESH BUTTON */}
      <div className="text-end mt-3">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={fetchTasks}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh Dashboard
        </button>
      </div>

      {/* QUICK CREATE TASK MODAL */}
      <TaskFormModal
        show={showQuickCreate}
        onClose={() => {
          if (!savingTask) {
            setShowQuickCreate(false);
          }
        }}
        onSave={handleSaveQuickTask}
        saving={savingTask}
        boards={boards}
        requireBoard={true}
      />

    </div>
  );
}

export default DashboardPage;
