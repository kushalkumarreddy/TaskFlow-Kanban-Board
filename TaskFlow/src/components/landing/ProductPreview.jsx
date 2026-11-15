import React from 'react';

function ProductPreview() {
  return (
    <section className="product-section py-5">
      <div className="container">

        <div className="text-center mb-5">
          <span className="section-label">YOUR WORKSPACE</span>

          <h2 className="section-title mt-3">
            Everything in One Place
          </h2>

          <p className="section-description">
            Keep your projects, tasks and progress organized
            in one simple workspace.
          </p>
        </div>

        <div className="product-window shadow-lg">

          <div className="product-window-header">
            <div className="d-flex gap-2">
              <span className="window-dot bg-danger"></span>
              <span className="window-dot bg-warning"></span>
              <span className="window-dot bg-success"></span>
            </div>

            <span className="fw-semibold">TaskFlow Workspace</span>

            <i className="bi bi-three-dots"></i>
          </div>

          <div className="row g-0">

            <div className="col-md-3 product-sidebar p-4">
              <h5 className="fw-bold mb-4">
                <i className="bi bi-check2-square text-primary me-2"></i>
                TaskFlow
              </h5>

              <p className="preview-menu active">
                <i className="bi bi-grid me-2"></i> Dashboard
              </p>

              <p className="preview-menu">
                <i className="bi bi-kanban me-2"></i> My Boards
              </p>

              <p className="preview-menu">
                <i className="bi bi-list-check me-2"></i> All Tasks
              </p>

              <p className="preview-menu">
                <i className="bi bi-calendar3 me-2"></i> Calendar
              </p>
            </div>

            <div className="col-md-9 p-4">

              <h5 className="fw-bold">Project Overview</h5>

              <p className="text-secondary small">
                A visual workspace for your daily work.
              </p>

              <div className="row g-3 my-3">

                {[
                  { title: 'To Do', icon: 'bi-circle', color: 'primary' },
                  { title: 'In Progress', icon: 'bi-arrow-repeat', color: 'warning' },
                  { title: 'Review', icon: 'bi-eye', color: 'info' },
                  { title: 'Completed', icon: 'bi-check-circle', color: 'success' }
                ].map((item) => (

                  <div className="col-6 col-lg-3" key={item.title}>
                    <div className="preview-overview-card">
                      <i className={`bi ${item.icon} text-${item.color} fs-4`}></i>
                      <h6 className="mt-3 mb-0">{item.title}</h6>
                    </div>
                  </div>

                ))}

              </div>

              <div className="preview-empty-board text-center p-4">
                <i className="bi bi-kanban fs-1 text-primary"></i>
                <h6 className="fw-bold mt-3">Your workspace starts here</h6>
                <p className="text-secondary small mb-0">
                  Create boards and organize your tasks.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default ProductPreview;