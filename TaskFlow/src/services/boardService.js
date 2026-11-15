
import api from './api';

export const getUserBoards = async (userId) => {
  const response = await api.get('/boards', {
    params: { userId }
  });

  return response.data;
};

export const getBoardById = async (boardId) => {
  const response = await api.get(`/boards/${boardId}`);
  return response.data;
};

export const createBoard = async (boardData) => {
  const response = await api.post('/boards', boardData);
  return response.data;
};

export const updateBoard = async (boardId, boardData) => {
  const response = await api.patch(`/boards/${boardId}`, boardData);
  return response.data;
};

export const getBoardTasks = async (boardId, userId) => {
  const response = await api.get('/tasks', {
    params: { boardId, userId }
  });

  return response.data;
};

export const getUserTasksForBoards = async (userId) => {
  const response = await api.get('/tasks', {
    params: { userId }
  });

  return response.data;
};

export const deleteBoardWithTasks = async (boardId, userId) => {
  const tasks = await getBoardTasks(boardId, userId);

  for (const task of tasks) {
    await api.delete(`/tasks/${task.id}`);
  }

  await api.delete(`/boards/${boardId}`);

  return true;
};
