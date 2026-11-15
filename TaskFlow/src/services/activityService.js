
import api from './api';

// Get activity records for the logged-in user.
export const getUserActivities = async (userId) => {
  const response = await api.get('/activities', {
    params: { userId }
  });

  return response.data.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );
};

// Add a new activity record.
export const createActivity = async (activityData) => {
  const response = await api.post('/activities', {
    ...activityData,
    createdAt: new Date().toISOString()
  });

  return response.data;
};

// Remove an activity record.
export const deleteActivity = async (activityId) => {
  const response = await api.delete(`/activities/${activityId}`);
  return response.data;
};
