
export const getTodayDate = () => {

  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, '0');

  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;

};


// Format date for display
export const formatDate = (dateString) => {

  if (!dateString) {
    return 'No date';
  }

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

};


// Check whether a task is overdue
export const isTaskOverdue = (task) => {

  if (!task.dueDate || task.status === 'Completed') {
    return false;
  }

  return task.dueDate < getTodayDate();

};


// Check upcoming deadlines
export const isUpcomingTask = (task) => {

  if (!task.dueDate || task.status === 'Completed') {
    return false;
  }

  const today = getTodayDate();

  const futureDate = new Date();

  futureDate.setHours(0, 0, 0, 0);

  futureDate.setDate(futureDate.getDate() + 7);

  const year = futureDate.getFullYear();

  const month = String(futureDate.getMonth() + 1).padStart(2, '0');

  const day = String(futureDate.getDate()).padStart(2, '0');

  const endDate = `${year}-${month}-${day}`;

  return task.dueDate >= today && task.dueDate <= endDate;

};


// Format date and time
export const formatDateTime = (dateString) => {

  if (!dateString) {
    return 'Not available';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

};
