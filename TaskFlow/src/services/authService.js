
import api from './api';

// Register a new user.
// Public registration always creates a standard user account.
export const registerUser = async (userData) => {
  try {
    const email = userData.email.trim().toLowerCase();

    const existingUsers = await api.get('/users', {
      params: { email }
    });

    if (existingUsers.data.length > 0) {
      throw new Error('This email is already registered.');
    }

    const newUser = {
      name: userData.name.trim(),
      email,
      password: userData.password,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    const response = await api.post('/users', newUser);

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

// Login existing user or admin.
export const loginUser = async (email, password) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();

    const response = await api.get('/users', {
      params: { email: normalizedEmail }
    });

    const user = response.data.find(
      (item) => item.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    if (user.status === 'inactive') {
      throw new Error('This account has been deactivated. Contact the administrator.');
    }

    return {
      ...user,
      role: user.role === 'admin' ? 'admin' : 'user'
    };
  } catch (error) {
    if (
      error.message === 'Invalid email or password.' ||
      error.message.includes('deactivated')
    ) {
      throw error;
    }

    console.error('Login API error:', error);

    throw new Error(
      error.response?.data?.message ||
      'Unable to connect to the server.'
    );
  }
};
