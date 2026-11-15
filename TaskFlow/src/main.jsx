
import React from 'react';

import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import App from './App.jsx';

import './styles/boards.css';
import './styles/global.css';
import './styles/auth.css';
import './styles/landing.css';
import './styles/layout.css';
import './styles/dashboard.css';
import './styles/kanban.css';
import './styles/productivity.css';
import './styles/activity-settings.css';
import './styles/topbar-features.css';


ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>

    <BrowserRouter>
      <App />
    </BrowserRouter>

  </React.StrictMode>

);
