
import { createActivity } from '../services/activityService';

export const logActivity = async ({
  userId,
  action,
  description,
  boardId = null,
  boardName = '',
  taskId = null,
  taskTitle = ''
}) => {
  if (!userId || !action || !description) {
    return;
  }

  try {
    await createActivity({
      userId,
      action,
      description,
      boardId,
      boardName,
      taskId,
      taskTitle
    });
  } catch (error) {
    // Activity logging should not prevent the main action.
    console.error('Activity logging failed:', error);
  }
};
