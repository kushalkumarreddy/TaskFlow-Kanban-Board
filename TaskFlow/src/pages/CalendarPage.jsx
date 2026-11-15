
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserTasks } from '../services/taskService';
import { getUserBoards } from '../services/boardService';

function CalendarPage() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-');
  });

  const loadCalendarData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError('');

      const [taskData, boardData] = await Promise.all([
        getUserTasks(user.id),
        getUserBoards(user.id)
      ]);

      setTasks(taskData);
      setBoards(boardData);
    } catch (err) {
      console.error('Unable to load calendar:', err);
      setError('Unable to load calendar data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadCalendarData();
  }, [loadCalendarData]);

  const boardNames = useMemo(() => {
    return Object.fromEntries(
      boards.map((board) => [String(board.id), board.name])
    );
  }, [boards]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;

    const gridStart = new Date(year, month, 1 - startOffset);

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);

      const dateKey = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')
      ].join('-');

      return {
        date,
        dateKey,
        isCurrentMonth: date.getMonth() === month
      };
    });
  }, [currentMonth]);

  const tasksByDate = useMemo(() => {
    const grouped = {};

    tasks.forEach((task) => {
      if (!task.dueDate) return;

      if (!grouped[task.dueDate]) {
        grouped[task.dueDate] = [];
      }

      grouped[task.dueDate].push(task);
    });

    return grouped;
  }, [tasks]);

  const selectedTasks = tasksByDate[selectedDate] || [];

  const today = new Date();
  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-');

  const changeMonth = (amount) => {
    setCurrentMonth((previous) =>
      new Date(
        previous.getFullYear(),
        previous.getMonth() + amount,
        1
      )
    );
  };

  const goToToday = () => {
    const now = new Date();

    setCurrentMonth(
      new Date(now.getFullYear(), now.getMonth(), 1)
    );

    setSelectedDate(todayKey);
  };

  const monthTitle = currentMonth.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric'
  });

  const totalDueThisMonth = tasks.filter((task) => {
    if (!task.dueDate) return false;

    const due = new Date(`${task.dueDate}T00:00:00`);

    return (
      due.getFullYear() === currentMonth.getFullYear() &&
      due.getMonth() === currentMonth.getMonth()
    );
  }).length;

  const completedThisMonth = tasks.filter((task) => {
    if (!task.dueDate || task.status !== 'Completed') return false;

    const due = new Date(`${task.dueDate}T00:00:00`);

    return (
      due.getFullYear() === currentMonth.getFullYear() &&
      due.getMonth() === currentMonth.getMonth()
    );
  }).length;

  const getTaskColor = (task) => {
    if (task.status === 'Completed') return 'calendar-task-completed';
    if (task.priority === 'High') return 'calendar-task-high';
    if (task.priority === 'Medium') return 'calendar-task-medium';
    return 'calendar-task-low';
  };

  return (
    <div className="calendar-page">

      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Calendar</h2>
          <p className="text-secondary mb-0">
            Keep track of your task deadlines and schedule.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={loadCalendarData}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2" />
          Refresh
        </button>
      </div>

      {/* Calendar Statistics */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4">
          <div className="card border-0 calendar-stat-card">
            <div className="card-body p-3">
              <span className="text-secondary small">
                Tasks this month
              </span>
              <h3 className="fw-bold mb-0 mt-2">
                {totalDueThisMonth}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-4">
          <div className="card border-0 calendar-stat-card">
            <div className="card-body p-3">
              <span className="text-secondary small">
                Completed this month
              </span>
              <h3 className="fw-bold mb-0 mt-2">
                {completedThisMonth}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 calendar-stat-card">
            <div className="card-body p-3">
              <span className="text-secondary small">
                Tasks without a due date
              </span>
              <h3 className="fw-bold mb-0 mt-2">
                {tasks.filter((task) => !task.dueDate).length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={loadCalendarData}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="text-secondary mt-3">
            Loading calendar...
          </p>
        </div>
      ) : (
        <div className="row g-4">

          {/* Monthly Calendar */}
          <div className="col-12 col-xl-8">
            <div className="card border-0 calendar-main-card">
              <div className="card-body p-3 p-md-4">

                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                  <div>
                    <h4 className="fw-bold mb-0">
                      {monthTitle}
                    </h4>
                    <small className="text-secondary">
                      Monthly deadline overview
                    </small>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-light border"
                      onClick={goToToday}
                    >
                      Today
                    </button>

                    <button
                      className="btn btn-light border"
                      onClick={() => changeMonth(-1)}
                      aria-label="Previous month"
                    >
                      <i className="bi bi-chevron-left" />
                    </button>

                    <button
                      className="btn btn-light border"
                      onClick={() => changeMonth(1)}
                      aria-label="Next month"
                    >
                      <i className="bi bi-chevron-right" />
                    </button>
                  </div>
                </div>

                <div className="calendar-grid">

                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                    (day) => (
                      <div className="calendar-weekday" key={day}>
                        {day}
                      </div>
                    )
                  )}

                  {calendarDays.map((day) => {
                    const dayTasks = tasksByDate[day.dateKey] || [];

                    return (
                      <button
                        type="button"
                        key={day.dateKey}
                        className={[
                          'calendar-day',
                          !day.isCurrentMonth ? 'calendar-day-muted' : '',
                          day.dateKey === todayKey ? 'calendar-day-today' : '',
                          day.dateKey === selectedDate ? 'calendar-day-selected' : ''
                        ].filter(Boolean).join(' ')}
                        onClick={() => setSelectedDate(day.dateKey)}
                      >
                        <span className="calendar-day-number">
                          {day.date.getDate()}
                        </span>

                        {dayTasks.length > 0 && (
                          <div className="calendar-day-events">
                            {dayTasks.slice(0, 2).map((task) => (
                              <span
                                key={task.id}
                                className={`calendar-event-dot ${getTaskColor(task)}`}
                                title={task.title}
                              />
                            ))}

                            {dayTasks.length > 2 && (
                              <small>+{dayTasks.length - 2}</small>
                            )}
                          </div>
                        )}

                        {dayTasks.length > 0 && (
                          <span className="calendar-day-count">
                            {dayTasks.length}
                          </span>
                        )}
                      </button>
                    );
                  })}

                </div>

                <div className="d-flex flex-wrap gap-3 mt-4 calendar-legend">
                  <span>
                    <i className="calendar-legend-dot calendar-task-high" />
                    High priority
                  </span>
                  <span>
                    <i className="calendar-legend-dot calendar-task-medium" />
                    Medium priority
                  </span>
                  <span>
                    <i className="calendar-legend-dot calendar-task-low" />
                    Low priority
                  </span>
                  <span>
                    <i className="calendar-legend-dot calendar-task-completed" />
                    Completed
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* Selected Date Tasks */}
          <div className="col-12 col-xl-4">
            <div className="card border-0 calendar-main-card h-100">
              <div className="card-body p-3 p-md-4">
                <h5 className="fw-bold mb-1">Selected date</h5>

                <p className="text-secondary small mb-4">
                  {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                    'en-IN',
                    {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }
                  )}
                </p>

                {selectedTasks.length === 0 ? (
                  <div className="calendar-no-tasks text-center py-5">
                    <i className="bi bi-calendar2-check fs-1 d-block mb-3" />
                    <h6 className="fw-semibold">No tasks scheduled</h6>
                    <p className="text-secondary small mb-0">
                      There are no task deadlines on this date.
                    </p>
                  </div>
                ) : (
                  <div className="calendar-selected-tasks">
                    {selectedTasks.map((task) => (
                      <div className="calendar-selected-task" key={task.id}>
                        <div className="d-flex justify-content-between gap-2">
                          <div className="fw-semibold small">
                            {task.title}
                          </div>
                          <span className={`priority-badge ${
                            task.priority === 'High'
                              ? 'priority-high'
                              : task.priority === 'Low'
                                ? 'priority-low'
                                : 'priority-medium'
                          }`}>
                            {task.priority || 'Medium'}
                          </span>
                        </div>

                        <div className="text-secondary small mt-2">
                          <i className="bi bi-kanban me-1" />
                          {boardNames[String(task.boardId)] || 'Unknown board'}
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <span className="text-secondary small">
                            {task.status}
                          </span>

                          <Link
                            to={`/boards/${task.boardId}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Open board
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default CalendarPage;
