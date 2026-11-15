
import React, { useState } from 'react';

import {
  Link,
  useNavigate,
  Navigate
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import AuthLayout from '../layouts/AuthLayout';

import {
  validateEmail,
  validatePassword,
  validateName
} from '../utils/validators';

function RegisterPage() {

  const navigate = useNavigate();

  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  // Redirect already authenticated users
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Handle input changes
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: ''
    }));

    setError('');

  };

  // Validate registration form
  const validateForm = () => {

    const newErrors = {};

    if (!validateName(formData.name)) {
      newErrors.name =
        'Name must contain at least 2 characters.';
    }

    if (!validateEmail(formData.email.trim())) {
      newErrors.email =
        'Enter a valid email address.';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password =
        'Password must contain at least 8 characters.';
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword =
        'Passwords do not match.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

  // Handle registration
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');

    if (!validateForm()) {
      return;
    }

    try {

      setLoading(true);

      const normalizedEmail =
        formData.email.trim().toLowerCase();

      await register({

        name: formData.name.trim(),

        email: normalizedEmail,

        password: formData.password,

        createdAt: new Date().toISOString()

      });

      // Redirect to login with success message
      navigate('/login', {

        replace: true,

        state: {
          message: 'Account created successfully! Please sign in.'
        }

      });

    } catch (err) {

      setError(
        err.message || 'Registration failed. Please try again.'
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <AuthLayout>

      <div className="auth-card">

        {/* Registration Heading */}

        <div className="text-center mb-4">

          <div className="auth-icon">
            <i className="bi bi-person-plus"></i>
          </div>

          <h2 className="fw-bold mt-3">
            Create Your Account
          </h2>

          <p className="text-secondary">
            Start organizing your work with TaskFlow.
          </p>

        </div>

        {/* Registration Error */}

        {error && (

          <div className="alert alert-danger" role="alert">

            <i className="bi bi-exclamation-circle me-2"></i>

            {error}

          </div>

        )}

        {/* Registration Form */}

        <form onSubmit={handleSubmit} noValidate>

          {/* Full Name */}

          <div className="mb-3">

            <label className="form-label fw-semibold">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              className={`form-control auth-field ${
                errors.name ? 'is-invalid' : ''
              }`}
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />

            {errors.name && (

              <small className="text-danger">
                {errors.name}
              </small>

            )}

          </div>

          {/* Email */}

          <div className="mb-3">

            <label className="form-label fw-semibold">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              className={`form-control auth-field ${
                errors.email ? 'is-invalid' : ''
              }`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />

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

              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`form-control ${
                  errors.password ? 'is-invalid' : ''
                }`}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="input-group-text password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? 'Hide password' : 'Show password'
                }
              >

                <i className={`bi ${
                  showPassword ? 'bi-eye-slash' : 'bi-eye'
                }`}></i>

              </button>

            </div>

            {errors.password && (

              <small className="text-danger">
                {errors.password}
              </small>

            )}

            <small className="text-secondary">
              Use at least 8 characters.
            </small>

          </div>

          {/* Confirm Password */}

          <div className="mb-4">

            <label className="form-label fw-semibold">
              Confirm Password
            </label>

            <div className="input-group auth-input">

              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className={`form-control ${
                  errors.confirmPassword ? 'is-invalid' : ''
                }`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="input-group-text password-toggle"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                aria-label={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
              >

                <i className={`bi ${
                  showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'
                }`}></i>

              </button>

            </div>

            {errors.confirmPassword && (

              <small className="text-danger">
                {errors.confirmPassword}
              </small>

            )}

          </div>

          {/* Create Account Button */}

          <button
            type="submit"
            className="btn btn-primary w-100 py-3 fw-semibold"
            disabled={loading}
          >

            {loading ? (

              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Creating Account...
              </>

            ) : (

              <>
                Create Account
                <i className="bi bi-arrow-right ms-2"></i>
              </>

            )}

          </button>

        </form>

        {/* Login Link */}

        <div className="text-center mt-4">

          <p className="text-secondary mb-0">

            Already have an account?{' '}

            <Link
              to="/login"
              className="fw-semibold text-primary"
            >
              Sign In
            </Link>

          </p>

        </div>

      </div>

    </AuthLayout>

  );

}

export default RegisterPage;
    