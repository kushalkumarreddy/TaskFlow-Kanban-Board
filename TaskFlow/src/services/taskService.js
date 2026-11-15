
import api from './api';

// Get all tasks belonging to a user.
export const getUserTasks = async (userId) => {
  const response = await api.get('/tasks', {
    params: { userId }
  });

  return response.data;
};

// Get tasks belonging to a particular board.
export const getBoardTasks = async (boardId, userId) => {
  const response = await api.get('/tasks', {
    params: { boardId, userId }
  });

  return response.data;
};

// Get one task.
export const getTaskById = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
};

// Create a task.
export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

// Update a task.
export const updateTask = async (taskId, taskData) => {
  const response = await api.patch(`/tasks/${taskId}`, taskData);
  return response.data;
};

// Delete a task.
export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};
