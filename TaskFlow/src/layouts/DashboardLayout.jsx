
import React from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

function DashboardLayout() {
  const closeMobileSidebar = () => {
    const sidebarElement = document.getElementById('mobileSidebar');

    if (sidebarElement && window.bootstrap?.Offcanvas) {
      window.bootstrap.Offcanvas
        .getOrCreateInstance(sidebarElement)
        .hide();
    }
  };

  return (
    <div className="app-layout">

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <div
        className="offcanvas offcanvas-start mobile-sidebar"
        tabIndex="-1"
        id="mobileSidebar"
        aria-labelledby="mobileSidebarLabel"
      >
        <div className="offcanvas-header">
          <h5
            className="offcanvas-title"
            id="mobileSidebarLabel"
          >
            TaskFlow
          </h5>

          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>

        <div className="offcanvas-body p-0">
          <Sidebar
            mobile={true}
            onNavigate={closeMobileSidebar}
          />
        </div>
      </div>

      {/* Main Application Area */}
      <div className="app-main">

        {/* Top Navigation */}
        <Topbar />

        {/* Current Page */}
        <main className="app-content">
          <div className="app-content-inner">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;
