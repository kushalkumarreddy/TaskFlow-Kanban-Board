
import React, { useState } from 'react';
import {
  Link,
  useNavigate,
  Navigate,
  useLocation
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';

import {
  validateEmail,
  validatePassword
} from '../utils/validators';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect authenticated accounts to their correct dashboard.
  if (isAuthenticated) {
    return (
      <Navigate
        to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
        replace
      />
    );
  }

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: ''
    }));

    setError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password =
        'Password must contain at least 8 characters.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setLoading(true);

      const loggedInUser = await login(
        formData.email.trim().toLowerCase(),
        formData.password,
        formData.rememberMe
      );

      navigate(
        loggedInUser.role === 'admin'
          ? '/admin/dashboard'
          : '/dashboard',
        { replace: true }
      );
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">

        <div className="text-center mb-4">
          <div className="auth-icon">
            <i className="bi bi-person-lock"></i>
          </div>

          <h2 className="fw-bold mt-3">
            Welcome Back!
          </h2>

          <p className="text-secondary">
            Sign in to continue to your workspace.
          </p>
        </div>

        {location.state?.message && (
          <div className="alert alert-success" role="alert">
            <i className="bi bi-check-circle me-2"></i>
            {location.state.message}
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Email Address
            </label>

            <div className="input-group auth-input">
              <span className="input-group-text">
                <i className="bi bi-envelope"></i>
              </span>

              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            {errors.email && (
              <small className="text-danger">
                {errors.email}
              </small>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Password
            </label>

            <div className="input-group auth-input">
              <span className="input-group-text">
                <i className="bi bi-lock"></i>
              </span>

              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="input-group-text password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>

            {errors.password && (
              <small className="text-danger">
                {errors.password}
              </small>
            )}
          </div>

          {/* Remember Me */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />

              <label
                className="form-check-label text-secondary"
                htmlFor="rememberMe"
              >
                Remember me
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-3 fw-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <i className="bi bi-arrow-right ms-2"></i>
              </>
            )}
          </button>

        </form>

        <div className="text-center mt-4">
          <p className="text-secondary mb-0">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="fw-semibold text-primary"
            >
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </AuthLayout>
  );
}

export default LoginPage;
