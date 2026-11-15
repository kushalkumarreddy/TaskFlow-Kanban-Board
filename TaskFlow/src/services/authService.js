import api from './api';

// Register new user
export const registerUser = async (userData) => {

  try {

    const existingUsers = await api.get('/users', {
      params: {
        email: userData.email
      }
    });

    if (existingUsers.data.length > 0) {
      throw new Error('This email is already registered.');
    }

    const response = await api.post('/users', userData);

    return response.data;

  } catch (error) {

    if (error.message === 'This email is already registered.') {
      throw error;
    }

    console.error('Registration API error:', error);

    throw new Error(
      error.response?.data?.message ||
      'Unable to register. Please try again.'
    );

  }

};

// Login existing user
export const loginUser = async (email, password) => {

  try {

    const response = await api.get('/users', {
      params: {
        email: email
      }
    });

    const users = response.data;

    const user = users.find(
      (item) => item.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    return user;

  } catch (error) {

    if (error.message === 'Invalid email or password.') {
      throw error;
    }

    console.error('Login API error:', error);

    throw new Error(
      error.response?.data?.message ||
      'Unable to connect to the server.'
    );

  }

};