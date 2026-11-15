import React from 'react';

function AuthLayout({ children }) {

  return (

    <div className="auth-page">

      <div className="container">

        <div className="auth-brand text-center">
          <a href="/" className="text-decoration-none">
            <span className="text-primary">Task</span>
            <span className="text-dark">Flow</span>
            <i className="bi bi-check2-square text-primary ms-2"></i>
          </a>
        </div>

        <div className="auth-container">
          {children}
        </div>

        <p className="auth-copyright text-center">
          © {new Date().getFullYear()} TaskFlow. All rights reserved.
        </p>

      </div>

    </div>

  );

}

export default AuthLayout;